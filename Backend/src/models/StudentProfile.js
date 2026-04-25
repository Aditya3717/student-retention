import mongoose from 'mongoose';

const studentProfileSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    studentId: {
        type: String,
        required: true,
        unique: true,
    },
    gpa: {
        type: Number,
        default: 0,
    },
    attendance: {
        type: Number,
        default: 0,
    },
    academicHistory: [
        {
            semester: String,
            gpa: Number, // TGPA
            subjects: [
                {
                    code: String,
                    name: String,
                    grade: String,
                    credits: Number,
                    attendance: Number,
                    instructor: String,
                    status: { type: String, default: 'Completed' }
                }
            ]
        },
    ],
    skills: [
        {
            name: String,
            level: Number, // 0-100
        },
    ],
    dropoutRisk: {
        score: { type: Number, default: 0 },
        category: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Low' },
    },
    careerRecommendations: [
        {
            title: String,
            matchPercentage: Number,
        },
    ],
});

export default mongoose.model('StudentProfile', studentProfileSchema);
