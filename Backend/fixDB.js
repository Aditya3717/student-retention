import mongoose from 'mongoose';
import dotenv from 'dotenv';
import StudentProfile from './src/models/StudentProfile.js';

dotenv.config();

const fixDatabase = async () => {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/student-retention');
        console.log('✅ Connected.');

        // For Batch 2025, if they only have "Semester 1", rename it to "Semester 2"
        const profiles = await StudentProfile.find({ batch: '2025' });
        let updatedCount = 0;

        for (const profile of profiles) {
            if (!profile.academicHistory) continue;

            let modified = false;
            for (let sem of profile.academicHistory) {
                if (sem.semester === 'Semester 1') {
                    sem.semester = 'Semester 2';
                    modified = true;
                }
            }

            if (modified) {
                await profile.save();
                updatedCount++;
            }
        }

        console.log(`\n🎉 FIXED! Renamed Semester 1 to Semester 2 for ${updatedCount} students in Batch 2025.`);
        process.exit(0);
    } catch (error) {
        console.error('❌ Error fixing DB:', error);
        process.exit(1);
    }
};

fixDatabase();
