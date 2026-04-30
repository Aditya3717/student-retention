import mongoose from 'mongoose';
import dotenv from 'dotenv';
import StudentProfile from './src/models/StudentProfile.js';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/student-retention';

mongoose.connect(MONGODB_URI).then(() => console.log('MongoDB connected')).catch(err => console.log(err));

// Approximate scale to create realistic variance between semesters
const gradePoints = {
    'O': 10, 'A+': 10, 'A': 9, 'A-': 8.5, 'B+': 8, 'B': 7, 'B-': 6.5, 'C+': 6, 'C': 5.5, 'P': 5, 'F': 0, 'N/A': 0
};

const updateGPA = async () => {
    try {
        console.log('Fetching profiles...');
        const profiles = await StudentProfile.find({});
        console.log(`Found ${profiles.length} profiles. Updating...`);
        
        let bulkOps = [];
        let count = 0;
        
        for (const profile of profiles) {
            for (const history of profile.academicHistory) {
                let semPoints = 0;
                let semCredits = 0;
                
                for (const subject of history.subjects) {
                    const grade = subject.grade.trim();
                    const pts = gradePoints[grade] !== undefined ? gradePoints[grade] : 0;
                    semPoints += pts * subject.credits;
                    semCredits += subject.credits;
                }
                
                const semGpa = semCredits > 0 ? (semPoints / semCredits) : 0;
                
                // Set the specific semester GPA rather than the overall CGPA
                history.gpa = parseFloat(semGpa.toFixed(2));
            }
            
            bulkOps.push({
                updateOne: {
                    filter: { _id: profile._id },
                    update: { $set: { academicHistory: profile.academicHistory } }
                }
            });
            
            count++;
            if (bulkOps.length === 500) {
                await StudentProfile.bulkWrite(bulkOps);
                console.log(`Updated ${count} / ${profiles.length}`);
                bulkOps = [];
            }
        }
        
        if (bulkOps.length > 0) {
            await StudentProfile.bulkWrite(bulkOps);
            console.log(`Updated ${count} / ${profiles.length}`);
        }
        
        console.log('Finished updating GPAs!');
        process.exit();
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
};

updateGPA();
