import StudentProfile from '../models/StudentProfile.js';
import User from '../models/User.js';

// @desc    Get student dashboard data
// @route   GET /api/students/dashboard
// @access  Private (Student)
export const getDashboard = async (req, res) => {
    try {
        const profile = await StudentProfile.findOne({ user: req.user.id });

        if (!profile) {
            return res.status(404).json({ success: false, message: 'Student profile not found' });
        }

        const rank = await StudentProfile.countDocuments({ gpa: { $gt: profile.gpa } }) + 1;

        res.status(200).json({
            success: true,
            data: {
                gpa: profile.gpa,
                attendance: profile.attendance,
                academicHistory: profile.academicHistory,
                recommendations: profile.careerRecommendations,
                dropoutRisk: profile.dropoutRisk,
                studentId: profile.studentId,
                rank: rank
            },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get full student profile
// @route   GET /api/students/profile
// @access  Private (Student)
export const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        const profile = await StudentProfile.findOne({ user: req.user.id });

        if (!profile) {
            return res.status(404).json({ success: false, message: 'Student profile not found' });
        }

        res.status(200).json({
            success: true,
            data: {
                name: user.name,
                email: user.email,
                studentId: profile.studentId,
                gpa: profile.gpa,
                attendance: profile.attendance,
                skills: profile.skills,
                dropoutRisk: profile.dropoutRisk,
                careerRecommendations: profile.careerRecommendations,
                academicHistory: profile.academicHistory,
            },
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Update student skills
// @route   PUT /api/students/skills
// @access  Private (Student)
export const updateSkills = async (req, res) => {
    try {
        const { skills } = req.body;
        let profile = await StudentProfile.findOne({ user: req.user.id });

        if (!profile) {
            return res.status(404).json({ success: false, message: 'Student profile not found' });
        }

        profile.skills = skills;
        await profile.save();

        res.status(200).json({ success: true, data: profile.skills });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
