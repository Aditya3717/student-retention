import mongoose from 'mongoose';
import dotenv from 'dotenv';
import StudentProfile from './src/models/StudentProfile.js';

dotenv.config();

const fixDatabase = async () => {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/eduguard');
        console.log('✅ Connected.');

        const profiles = await StudentProfile.find({});
        let updatedCount = 0;

        for (const profile of profiles) {
            if (!profile.academicHistory) continue;

            const originalLength = profile.academicHistory.length;
            
            // Filter out any semester that has NO subjects
            profile.academicHistory = profile.academicHistory.filter(sem => 
                sem.subjects && sem.subjects.length > 0
            );

            if (profile.academicHistory.length !== originalLength) {
                // We removed a bad semester, save it back
                await profile.save();
                updatedCount++;
            }
        }

        console.log(`\n🎉 FIXED! Cleaned up empty semesters from ${updatedCount} students.`);
        process.exit(0);
    } catch (error) {
        console.error('❌ Error fixing DB:', error);
        process.exit(1);
    }
};

fixDatabase();
