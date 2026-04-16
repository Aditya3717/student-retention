import User from '../models/User.js';
import StudentProfile from '../models/StudentProfile.js';

// @desc    Get all students with profiles
// @route   GET /api/admin/students
// @access  Private (Admin)
export const getAllStudents = async (req, res) => {
    try {
        const students = await StudentProfile.find().populate('user', 'name email');
        res.status(200).json({ success: true, count: students.length, data: students });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get at-risk students
// @route   GET /api/admin/at-risk
// @access  Private (Admin)
export const getAtRiskStudents = async (req, res) => {
    try {
        const atRisk = await StudentProfile.find({
            'dropoutRisk.category': { $in: ['Medium', 'High'] }
        }).populate('user', 'name email');

        res.status(200).json({ success: true, count: atRisk.length, data: atRisk });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
