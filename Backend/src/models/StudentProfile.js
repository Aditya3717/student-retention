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
        // NOTE: uniqueness is enforced by compound index {studentId, batch} below
    },
    batch: {
        type: String,   // e.g. "2025", "2026"
        required: true,
        index: true,
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

// Compound unique index: same studentId can exist in different batches
studentProfileSchema.index({ studentId: 1, batch: 1 }, { unique: true });

export default mongoose.model('StudentProfile', studentProfileSchema);
