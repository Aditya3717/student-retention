import mongoose from 'mongoose';
import dotenv from 'dotenv';
import xlsx from 'xlsx';
import path from 'path';

import User from './src/models/User.js';
import StudentProfile from './src/models/StudentProfile.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/student-retention';

mongoose.connect(MONGODB_URI).then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));

const importData = async () => {
    try {
        // ─────────────────────────────────────────────────────────────────
        // ⚙️  CONFIGURE THESE SETTINGS BEFORE EACH IMPORT RUN
        // ─────────────────────────────────────────────────────────────────
        const BATCH          = '2025';                                       // ← Batch to import
        const EXCEL_FILE     = path.resolve('../2023_Btech_cse_sem2_updated.xlsx'); // ← Source file
        const SEMESTER_LABEL = 'Semester 2';                                 // ← Target Semester (e.g., 'Semester 1', 'Semester 2')
        // ─────────────────────────────────────────────────────────────────

        console.log(`\n📦 Starting import for Batch ${BATCH}...`);
        console.log(`📄 Reading file: ${EXCEL_FILE}\n`);

        const workbook  = xlsx.readFile(EXCEL_FILE);
        const sheetName = workbook.SheetNames[0];
        const sheet     = workbook.Sheets[sheetName];
        const data      = xlsx.utils.sheet_to_json(sheet);

        console.log(`📊 Found ${data.length} records. Preparing data for bulk upsert...`);

        const userOps = [];
        const profileOps = [];

        for (const row of data) {
            if (!row['Regd No.']) continue;

            const regNo = String(row['Regd No.']).trim();
            if (!/^\d+$/.test(regNo)) continue;

            const name = row['Name'] ? row['Name'].trim() : 'Unknown';
            const email = `${regNo}@lpu.in`;

            // Prepare User Upsert
            userOps.push({
                updateOne: {
                    filter: { registrationNumber: regNo },
                    update: {
                        $set: {
                            name,
                            email,
                            role: 'student',
                            verificationStatus: 'approved',
                            registrationNumber: regNo,
                            batch: BATCH
                        },
                        $setOnInsert: {
                            password: regNo // Only set password on new creation
                        }
                    },
                    upsert: true
                }
            });

            const gpa        = Number(row['Cgpa']) || 0;
            const attendance = Number(row['Current_Attendance']) || 0;

            const subjects = [];
            const subjectPrefixes = new Set();
            Object.keys(row).forEach(key => {
                if (key.endsWith('_Code')) subjectPrefixes.add(key.replace('_Code', ''));
            });

            subjectPrefixes.forEach(prefix => {
                const code  = row[`${prefix}_Code`];
                const subjName  = row[`${prefix}_Name`];
                const grade = row[`${prefix}_Grade`] || 'N/A';
                if (code && subjName) {
                    subjects.push({
                        code, name: subjName, grade,
                        credits:    3,
                        attendance,
                        instructor: 'TBD',
                        status:     'Completed'
                    });
                }
            });

            const newSemesterData = {
                semester: SEMESTER_LABEL,
                gpa: gpa || 0,
                subjects: subjects
            };

            const riskScore = Math.max(0, Math.min(100,
                100 - ((gpa / 10) * 60) - ((attendance / 100) * 40)
            ));
            let category = 'Low', reason = 'Steady performance';
            if (riskScore > 65)      { category = 'High';   reason = attendance < 70 ? 'Critical Attendance' : 'Critical CGPA'; }
            else if (riskScore > 40) { category = 'Medium'; reason = attendance < 80 ? 'Low Engagement' : 'Academic Warning'; }

            // Prepare Profile Upsert
            profileOps.push({
                updateOne: {
                    filter: { studentId: regNo },
                    update: {
                        $set: {
                            studentId: regNo,
                            batch: BATCH,
                            gpa,
                            attendance,
                            dropoutRisk: { score: Math.round(riskScore), category, reason }
                        },
                        // Pull any existing entry for this semester to replace it
                        $pull: { academicHistory: { semester: SEMESTER_LABEL } }
                    },
                    upsert: true
                }
            });

            // Second operation to push the new semester data
            profileOps.push({
                updateOne: {
                    filter: { studentId: regNo },
                    update: {
                        $push: { academicHistory: newSemesterData }
                    }
                }
            });
        }

        console.log(`👤 Upserting ${userOps.length} users...`);
        const userChunkSize = 500;
        for (let i = 0; i < userOps.length; i += userChunkSize) {
            await User.bulkWrite(userOps.slice(i, i + userChunkSize));
            console.log(`   Processed users ${Math.min(i + userChunkSize, userOps.length)}/${userOps.length}...`);
        }

        console.log('\n📋 Updating users with _id for profiles...');
        // We need to link User _id to StudentProfile user field.
        // Doing this after upserting users.
        const allUpsertedUsers = await User.find({ registrationNumber: { $in: data.map(r => String(r['Regd No.']).trim()) } }, '_id registrationNumber');
        const userMap = new Map(allUpsertedUsers.map(u => [u.registrationNumber, u._id]));

        for (const op of profileOps) {
            if (op.updateOne && op.updateOne.update.$set) {
                const regNo = op.updateOne.filter.studentId;
                if (userMap.has(regNo)) {
                    op.updateOne.update.$set.user = userMap.get(regNo);
                }
            }
        }

        console.log('💾 Upserting Student Profiles and appending semester data...');
        const profileChunkSize = 500;
        for (let i = 0; i < profileOps.length; i += profileChunkSize) {
            await StudentProfile.bulkWrite(profileOps.slice(i, i + profileChunkSize));
            console.log(`   Processed profile operations ${Math.min(i + profileChunkSize, profileOps.length)}/${profileOps.length}...`);
        }

        console.log(`\n🎉 Import finished! Batch ${BATCH}: ${profileOps.length / 2} students processed successfully.\n`);
        process.exit(0);
    } catch (error) {
        console.error('❌ Error importing data:', error);
        process.exit(1);
    }
};

importData();
