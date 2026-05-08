import mongoose from 'mongoose';
import dotenv from 'dotenv';
import xlsx from 'xlsx';
import path from 'path';
import StudentProfile from './src/models/StudentProfile.js';

dotenv.config();

const gradeToPoints = {
    'O': 10, 'A+': 9, 'A': 8, 'B+': 7, 'B': 6, 'C': 5, 'D': 4, 'F': 0
};

const calculateGPA = (subjects) => {
    let totalPoints = 0;
    let totalCredits = 0;
    subjects.forEach(s => {
        const grade = (s.grade || '').trim().toUpperCase();
        if (gradeToPoints[grade] !== undefined) {
            totalPoints += gradeToPoints[grade] * s.credits;
            totalCredits += s.credits;
        }
    });
    if (totalCredits === 0) return 0;
    return Number((totalPoints / totalCredits).toFixed(2));
};

const fixBatch2025 = async () => {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/student-retention');
        console.log('✅ Connected.');

        const EXCEL_FILE = path.resolve('../2023_Btech_cse_sem2_updated.xlsx');
        console.log(`📄 Reading file: ${EXCEL_FILE}`);
        const workbook = xlsx.readFile(EXCEL_FILE);
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const data = xlsx.utils.sheet_to_json(sheet);

        console.log(`📊 Found ${data.length} records in Excel. Processing real Sem 1 and Sem 2 data...`);

        const bulkOps = [];

        for (const row of data) {
            if (!row['Regd No.']) continue;
            const regNo = String(row['Regd No.']).trim();
            if (!/^\d+$/.test(regNo)) continue;

            const attendance = Number(row['Current_Attendance']) || 0;

            const sem1Subjects = [];
            const sem2Subjects = [];

            // CS201 to CS208 goes to Semester 1
            // CS209 to CS216 goes to Semester 2
            for (let i = 201; i <= 216; i++) {
                const prefix = `CS${i}`;
                const code = row[`${prefix}_Code`];
                const name = row[`${prefix}_Name`];
                const grade = row[`${prefix}_Grade`] || 'N/A';

                if (code && name) {
                    const subjectData = {
                        code, name, grade,
                        credits: 3,
                        attendance,
                        instructor: 'TBD',
                        status: 'Completed'
                    };

                    if (i <= 208) {
                        sem1Subjects.push(subjectData);
                    } else {
                        sem2Subjects.push(subjectData);
                    }
                }
            }

            const sem1Gpa = calculateGPA(sem1Subjects);
            const sem2Gpa = calculateGPA(sem2Subjects);

            const academicHistory = [];
            if (sem1Subjects.length > 0) {
                academicHistory.push({ semester: 'Semester 1', gpa: sem1Gpa, subjects: sem1Subjects });
            }
            if (sem2Subjects.length > 0) {
                academicHistory.push({ semester: 'Semester 2', gpa: sem2Gpa, subjects: sem2Subjects });
            }

            bulkOps.push({
                updateOne: {
                    filter: { studentId: regNo, batch: '2025' },
                    update: {
                        $set: {
                            academicHistory: academicHistory
                        }
                    }
                }
            });
        }

        console.log(`💾 Applying real dual-semester data to DB via bulkWrite (${bulkOps.length} ops)...`);
        const chunkSize = 500;
        for (let i = 0; i < bulkOps.length; i += chunkSize) {
            await StudentProfile.bulkWrite(bulkOps.slice(i, i + chunkSize));
            console.log(`   Processed ${Math.min(i + chunkSize, bulkOps.length)}/${bulkOps.length}...`);
        }

        console.log(`\n🎉 Successfully restored REAL Semester 1 and Semester 2 data for Batch 2025!`);
        process.exit(0);
    } catch (error) {
        console.error('❌ Error fixing data:', error);
        process.exit(1);
    }
};

fixBatch2025();
