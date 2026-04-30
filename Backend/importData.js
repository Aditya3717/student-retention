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
        console.log('Clearing old student data (this might take a few seconds)...');
        await StudentProfile.deleteMany({});
        await User.deleteMany({ role: 'student' });
        console.log('Old student data cleared.');

        const workbook = xlsx.readFile(path.resolve('../2027_Btech_cse_sem2_updated.xlsx'));
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const data = xlsx.utils.sheet_to_json(sheet);

        console.log(`Found ${data.length} records. Preparing data for bulk insert...`);

        const newUsers = [];
        const studentProfilesData = [];
        
        for (const row of data) {
            if (!row['Regd No.']) continue;
            
            const regNo = String(row['Regd No.']).trim();
            if (!/^\d+$/.test(regNo)) {
                continue; // Skip invalid rows like 'Applied filters...'
            }
            
            const name = row['Name'] ? row['Name'].trim() : 'Unknown';
            const email = `${regNo}@lpu.in`;
            const gpa = Number(row['Cgpa']) || 0;
            const attendance = Number(row['Current_Attendance']) || 0;

            newUsers.push({
                name,
                email,
                password: regNo, // Will be hashed by pre-save hook? Wait, insertMany might skip hooks depending on Mongoose version, but let's see. 
                // Wait! insertMany does NOT trigger `save` middleware!
                // We should use `create` or hash passwords manually. 
                // Since this is a test script, we can just hash passwords here, or use Promise.all with create in chunks.
                role: 'student',
                verificationStatus: 'approved',
                registrationNumber: regNo,
                rowRef: row // Temporary reference to link later
            });
        }

        console.log('Inserting Users in chunks...');
        const chunkSize = 500;
        let insertedUsersMap = new Map();

        // Use Promise.all with chunks and `create` to ensure password hashing fires
        for (let i = 0; i < newUsers.length; i += chunkSize) {
            const chunk = newUsers.slice(i, i + chunkSize);
            const createdDocs = await User.create(chunk);
            for (const doc of createdDocs) {
                insertedUsersMap.set(doc.registrationNumber, doc._id);
            }
            console.log(`Created users ${i + chunk.length}/${newUsers.length}...`);
        }

        console.log('Preparing Student Profiles...');
        for (const user of newUsers) {
            const row = user.rowRef;
            const regNo = user.registrationNumber;
            const userId = insertedUsersMap.get(regNo);
            const gpa = Number(row['Cgpa']) || 0;
            const attendance = Number(row['Current_Attendance']) || 0;

            const sem1Subjects = [];
            for (let i = 201; i <= 208; i++) {
                const codeKey = `CS${i}_Code`;
                const nameKey = `CS${i}_Name`;
                const gradeKey = `CS${i}_Grade`;
                if (row[codeKey] && row[nameKey]) {
                    sem1Subjects.push({
                        code: row[codeKey], name: row[nameKey], grade: row[gradeKey] || 'N/A',
                        credits: 3, attendance: attendance, instructor: 'TBD', status: 'Completed'
                    });
                }
            }

            const sem2Subjects = [];
            for (let i = 209; i <= 216; i++) {
                const codeKey = `CS${i}_Code`;
                const nameKey = `CS${i}_Name`;
                const gradeKey = `CS${i}_Grade`;
                if (row[codeKey] && row[nameKey]) {
                    sem2Subjects.push({
                        code: row[codeKey], name: row[nameKey], grade: row[gradeKey] || 'N/A',
                        credits: 3, attendance: attendance, instructor: 'TBD', status: 'Completed'
                    });
                }
            }

            studentProfilesData.push({
                user: userId,
                studentId: regNo,
                gpa: gpa,
                attendance: attendance,
                academicHistory: [
                    { semester: "Semester 1", gpa: gpa, subjects: sem1Subjects },
                    { semester: "Semester 2", gpa: gpa, subjects: sem2Subjects }
                ],
                skills: [],
                dropoutRisk: { score: 0, category: 'Low' },
                careerRecommendations: []
            });
        }

        console.log('Inserting Student Profiles...');
        await StudentProfile.insertMany(studentProfilesData);

        console.log('Import finished successfully!');
        process.exit();
    } catch (error) {
        console.error('Error importing data:', error);
        process.exit(1);
    }
};

importData();
