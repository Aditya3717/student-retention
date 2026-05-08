import mongoose from 'mongoose';
import dotenv from 'dotenv';
import StudentProfile from './src/models/StudentProfile.js';

dotenv.config();

const generateSem1 = async () => {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/student-retention');
        console.log('✅ Connected.');

        const profiles = await StudentProfile.find({ batch: '2025' });
        let updatedCount = 0;

        for (const profile of profiles) {
            // Only proceed if they have Semester 2 but no Semester 1
            const hasSem2 = profile.academicHistory.some(s => s.semester === 'Semester 2');
            const hasSem1 = profile.academicHistory.some(s => s.semester === 'Semester 1');

            if (hasSem2 && !hasSem1) {
                const sem2 = profile.academicHistory.find(s => s.semester === 'Semester 2');
                
                // Generate a believable Semester 1 GPA (random fluctuation between -0.4 and +0.4)
                const fluctuation = (Math.random() * 0.8) - 0.4;
                let sem1Gpa = sem2.gpa + fluctuation;
                sem1Gpa = Math.max(0, Math.min(10, sem1Gpa)); // Clamp between 0 and 10
                sem1Gpa = Number(sem1Gpa.toFixed(2));

                const sem1Data = {
                    semester: 'Semester 1',
                    gpa: sem1Gpa,
                    subjects: [
                        { name: 'Mathematics I', grade: 'B+', credits: 4, attendance: 85, status: 'Completed' },
                        { name: 'Physics I', grade: 'A', credits: 4, attendance: 90, status: 'Completed' },
                        { name: 'Programming in C', grade: 'A-', credits: 4, attendance: 88, status: 'Completed' }
                    ]
                };

                // Unshift to put Semester 1 before Semester 2
                profile.academicHistory.unshift(sem1Data);
                await profile.save();
                updatedCount++;
            }
        }

        console.log(`\n🎉 Generated synthetic Semester 1 data for ${updatedCount} students to restore the trajectory chart!`);
        process.exit(0);
    } catch (error) {
        console.error('❌ Error generating data:', error);
        process.exit(1);
    }
};

generateSem1();
