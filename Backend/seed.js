import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from './src/models/User.js';
import StudentProfile from './src/models/StudentProfile.js';

dotenv.config();

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB Connected for seeding...');

        // Clear existing data
        await User.deleteMany();
        await StudentProfile.deleteMany();

        // Create a student user
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('password123', salt);

        const studentUser = await User.create({
            name: 'John Doe',
            email: '2021001@university.edu',
            password: 'password123', 
            role: 'student',
            registrationNumber: '2021001'
        });

        console.log('Student User Created');

        // Create Student Profile
        await StudentProfile.create({
            user: studentUser._id,
            studentId: '2021001',
            gpa: 3.72,
            attendance: 94,
            academicHistory: [
                {
                    semester: 'Sem 1',
                    gpa: 3.2,
                    subjects: [
                        { name: 'Mathematics I', grade: 'B+', credits: 4, attendance: 90 },
                        { name: 'Physics I', grade: 'B', credits: 4, attendance: 85 }
                    ]
                },
                {
                    semester: 'Sem 2',
                    gpa: 3.5,
                    subjects: [
                        { name: 'Mathematics II', grade: 'A-', credits: 4, attendance: 92 },
                        { name: 'Programming in C', grade: 'A', credits: 4, attendance: 95 }
                    ]
                },
                {
                    semester: 'Sem 3',
                    gpa: 3.4,
                    subjects: [
                        { name: 'Data Structures', grade: 'A', credits: 4, attendance: 98 },
                        { name: 'Digital Logic', grade: 'B+', credits: 4, attendance: 90 }
                    ]
                },
                {
                    semester: 'Sem 4',
                    gpa: 3.8,
                    subjects: [
                        { name: 'Operating Systems', grade: 'A', credits: 4, attendance: 94 },
                        { name: 'Database Systems', grade: 'A', credits: 4, attendance: 96 }
                    ]
                },
                {
                    semester: 'Sem 5',
                    gpa: 3.7,
                    subjects: [
                        { name: 'Computer Networks', grade: 'A-', credits: 4, attendance: 92 },
                        { name: 'Python Programming', grade: 'A', credits: 4, attendance: 95 }
                    ]
                }
            ],
            skills: [
                { name: 'React', level: 85 },
                { name: 'Node.js', level: 80 },
                { name: 'Python', level: 90 },
                { name: 'SQL', level: 75 }
            ],
            careerRecommendations: [
                { title: 'Full Stack Developer', matchPercentage: 92 },
                { title: 'Data Scientist', matchPercentage: 88 },
                { title: 'DevOps Engineer', matchPercentage: 75 }
            ]
        });

        console.log('Student Profile Created');

        // Create an Admin user for completeness
        await User.create({
            name: 'Admin User',
            email: 'admin@university.edu',
            password: 'adminpassword',
            role: 'admin',
            registrationNumber: 'ADMIN-01'
        });

        console.log('Admin User Created');

        console.log('Seeding completed successfully');
        process.exit();
    } catch (error) {
        console.error(`Error with seeding: ${error.message}`);
        process.exit(1);
    }
};

seedData();
