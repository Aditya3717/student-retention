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
        // ⚙️  CONFIGURE THESE TWO SETTINGS BEFORE EACH IMPORT RUN
        // ─────────────────────────────────────────────────────────────────
        const BATCH      = '2026';                                          // ← Batch to import
        const EXCEL_FILE = path.resolve('../Batch 2026.csv');                  // ← Source file
        // ─────────────────────────────────────────────────────────────────

        console.log(`\n📦 Starting import for Batch ${BATCH}...`);
        console.log(`📄 Reading file: ${EXCEL_FILE}\n`);

        // ── STEP 1: Read source file FIRST to get all reg numbers ──
        console.log(`📄 Pre-reading source file for cleanup reference...`);
        const sourceWorkbook = xlsx.readFile(EXCEL_FILE);
        const sourceSheet    = sourceWorkbook.Sheets[sourceWorkbook.SheetNames[0]];
        const sourceData     = xlsx.utils.sheet_to_json(sourceSheet);
        const allRegNos      = sourceData
            .filter(r => r['Regd No.'] && /^\d+$/.test(String(r['Regd No.']).trim()))
            .map(r => String(r['Regd No.']).trim());
        console.log(`   Found ${allRegNos.length} registration numbers in source file.\n`);

        // ── STEP 2: Full self-healing cleanup ──
        // Wipe ALL studentprofiles matching these studentIds (regardless of batch field)
        // This catches orphaned profiles from previous failed runs where batch wasn't set
        console.log(`🗑️  Wiping ALL existing profiles and users for these ${allRegNos.length} reg numbers...`);
        const existingProfiles = await StudentProfile.find({ studentId: { $in: allRegNos } }, '_id user');
        const profileUserIds   = existingProfiles.map(p => p.user).filter(Boolean);

        const profileDel = await StudentProfile.deleteMany({ studentId: { $in: allRegNos } });
        console.log(`   Removed ${profileDel.deletedCount} profile(s).`);

        // Wipe ALL matching user accounts
        const userDel = await User.deleteMany({ registrationNumber: { $in: allRegNos } });
        console.log(`   Removed ${userDel.deletedCount} user account(s).`);
        console.log(`✅ Cleanup complete. Starting fresh insert.\n`);

        // ── STEP 2: Read source file ──
        const workbook  = xlsx.readFile(EXCEL_FILE);
        const sheetName = workbook.SheetNames[0];
        const sheet     = workbook.Sheets[sheetName];
        const data      = xlsx.utils.sheet_to_json(sheet);

        console.log(`📊 Found ${data.length} records. Preparing data for bulk insert...`);

        const newUsers = [];

        for (const row of data) {
            if (!row['Regd No.']) continue;

            const regNo = String(row['Regd No.']).trim();
            if (!/^\d+$/.test(regNo)) continue; // Skip invalid rows

            const name = row['Name'] ? row['Name'].trim() : 'Unknown';

            newUsers.push({
                name,
                email:              `${regNo}@lpu.in`,
                password:           regNo,
                role:               'student',
                verificationStatus: 'approved',
                registrationNumber: regNo,
                batch:              BATCH,
                rowRef:             row   // Temporary reference to link profile later
            });
        }

        // ── STEP 3: Insert Users in chunks ──
        console.log(`👤 Inserting ${newUsers.length} users in chunks...`);
        const chunkSize      = 500;
        let insertedUsersMap = new Map();

        for (let i = 0; i < newUsers.length; i += chunkSize) {
            const chunk       = newUsers.slice(i, i + chunkSize);
            const createdDocs = await User.create(chunk);
            for (const doc of createdDocs) {
                insertedUsersMap.set(doc.registrationNumber, doc._id);
            }
            console.log(`   Created users ${Math.min(i + chunkSize, newUsers.length)}/${newUsers.length}...`);
        }

        // ── STEP 4: Build and insert Student Profiles ──
        console.log('\n📋 Preparing Student Profiles...');
        const studentProfilesData = [];

        for (const user of newUsers) {
            const row        = user.rowRef;
            const regNo      = user.registrationNumber;
            const userId     = insertedUsersMap.get(regNo);
            const gpa        = Number(row['Cgpa']) || 0;
            const attendance = Number(row['Current_Attendance']) || 0;

            // ── Dynamically extract subjects from columns ending in _Code/_Name/_Grade ──
            const sem1Subjects    = [];
            const subjectPrefixes = new Set();
            Object.keys(row).forEach(key => {
                if (key.endsWith('_Code')) subjectPrefixes.add(key.replace('_Code', ''));
            });

            subjectPrefixes.forEach(prefix => {
                const code  = row[`${prefix}_Code`];
                const name  = row[`${prefix}_Name`];
                const grade = row[`${prefix}_Grade`] || 'N/A';
                if (code && name) {
                    sem1Subjects.push({
                        code, name, grade,
                        credits:    3,
                        attendance,
                        instructor: 'TBD',
                        status:     'Completed'
                    });
                }
            });

            // Always ensure at least one semester entry so academic history is never empty
            const academicHistory = sem1Subjects.length > 0
                ? [{ semester: 'Semester 1', gpa, subjects: sem1Subjects }]
                : [{ semester: 'Semester 1', gpa: gpa || 0, subjects: [] }];

            // 10-point CGPA risk calculation
            const riskScore = Math.max(0, Math.min(100,
                100 - ((gpa / 10) * 60) - ((attendance / 100) * 40)
            ));
            let category = 'Low', reason = 'Steady performance';
            if (riskScore > 65)      { category = 'High';   reason = attendance < 70 ? 'Critical Attendance' : 'Critical CGPA'; }
            else if (riskScore > 40) { category = 'Medium'; reason = attendance < 80 ? 'Low Engagement' : 'Academic Warning'; }

            studentProfilesData.push({
                user:      userId,
                studentId: regNo,
                batch:     BATCH,
                gpa,
                attendance,
                academicHistory,
                skills:                [],
                dropoutRisk:           { score: Math.round(riskScore), category, reason },
                careerRecommendations: []
            });
        }

        console.log('💾 Inserting Student Profiles...');
        const profileChunkSize = 500;
        for (let i = 0; i < studentProfilesData.length; i += profileChunkSize) {
            await StudentProfile.insertMany(studentProfilesData.slice(i, i + profileChunkSize));
            console.log(`   Inserted profiles ${Math.min(i + profileChunkSize, studentProfilesData.length)}/${studentProfilesData.length}...`);
        }

        console.log(`\n🎉 Import finished! Batch ${BATCH}: ${studentProfilesData.length} students imported successfully.\n`);
        process.exit(0);
    } catch (error) {
        console.error('❌ Error importing data:', error);
        process.exit(1);
    }
};

importData();
