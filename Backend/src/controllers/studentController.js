import StudentProfile from '../models/StudentProfile.js';

// @desc    Get student dashboard data
// @route   GET /api/students/dashboard
// @access  Private (Student)
export const getDashboard = async (req, res) => {
    try {
        const profile = await StudentProfile.findOne({ user: req.user.id });

        if (!profile) {
            return res.status(404).json({ success: false, message: 'Student profile not found' });
        }

        res.status(200).json({
            success: true,
            data: {
                gpa: profile.gpa,
                attendance: profile.attendance,
                academicHistory: profile.academicHistory,
                recommendations: profile.careerRecommendations
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
