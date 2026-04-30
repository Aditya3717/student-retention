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
                rank: rank,
                skills: profile.skills || [],
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
        const { skills, recommendations } = req.body;
        let profile = await StudentProfile.findOne({ user: req.user.id });

        if (!profile) {
            return res.status(404).json({ success: false, message: 'Student profile not found' });
        }

        if (skills !== undefined) profile.skills = skills;
        if (recommendations !== undefined) profile.careerRecommendations = recommendations;

        await profile.save();

        res.status(200).json({ success: true, data: profile.skills });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// ── In-memory cache for batch stats (expensive full-collection scan) ──
let _batchStatsCache = null;
let _batchStatsCachedAt = 0;
const BATCH_STATS_TTL = 5 * 60 * 1000; // 5 minutes

// @desc    Get batch-wide statistics (CGPA avg, per-semester avg, attendance avg)
// @route   GET /api/students/batch-stats
// @access  Private (Student)
export const getBatchStats = async (req, res) => {
    try {
        // Serve from cache if still fresh
        if (_batchStatsCache && Date.now() - _batchStatsCachedAt < BATCH_STATS_TTL) {
            return res.status(200).json({ success: true, data: _batchStatsCache });
        }

        // Full collection scan (only runs every 5 min)
        const allProfiles = await StudentProfile.find({}, 'gpa attendance academicHistory');
        const total = allProfiles.length;

        if (total === 0) {
            return res.status(200).json({ success: true, data: { total: 0, batchCgpa: 0, batchAttendance: 0, semesterAverages: [], cgpaDistribution: [] } });
        }

        // Overall batch CGPA
        const batchCgpa = +(allProfiles.reduce((s, p) => s + (p.gpa || 0), 0) / total).toFixed(2);

        // Overall batch attendance
        const batchAttendance = +(allProfiles.reduce((s, p) => s + (p.attendance || 0), 0) / total).toFixed(1);

        // Per-semester average: collect all unique semester labels and average GPA for each
        const semMap = {};
        allProfiles.forEach(profile => {
            (profile.academicHistory || []).forEach(sem => {
                if (!sem.semester) return;
                if (!semMap[sem.semester]) semMap[sem.semester] = { sum: 0, count: 0 };
                semMap[sem.semester].sum += sem.gpa || 0;
                semMap[sem.semester].count += 1;
            });
        });
        const semesterAverages = Object.entries(semMap)
            .map(([semester, { sum, count }]) => ({ semester, avg: +(sum / count).toFixed(2) }))
            .sort((a, b) => a.semester.localeCompare(b.semester));

        // CGPA distribution buckets: <5, 5-6, 6-7, 7-8, 8-9, 9-10
        const buckets = [
            { label: '<5',  min: 0,  max: 5  },
            { label: '5-6', min: 5,  max: 6  },
            { label: '6-7', min: 6,  max: 7  },
            { label: '7-8', min: 7,  max: 8  },
            { label: '8-9', min: 8,  max: 9  },
            { label: '9+',  min: 9,  max: 11 },
        ];
        const cgpaDistribution = buckets.map(b => ({
            label: b.label,
            count: allProfiles.filter(p => (p.gpa || 0) >= b.min && (p.gpa || 0) < b.max).length,
        }));

        const result = { total, batchCgpa, batchAttendance, semesterAverages, cgpaDistribution };

        // Store in cache
        _batchStatsCache = result;
        _batchStatsCachedAt = Date.now();

        res.status(200).json({ success: true, data: result });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
