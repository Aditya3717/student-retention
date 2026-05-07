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

        // Rank is scoped to the student's own batch only
        const rank = await StudentProfile.countDocuments({
            gpa:   { $gt: profile.gpa },
            batch: profile.batch
        }) + 1;

        res.status(200).json({
            success: true,
            data: {
                gpa:             profile.gpa,
                attendance:      profile.attendance,
                academicHistory: profile.academicHistory,
                recommendations: profile.careerRecommendations,
                dropoutRisk:     profile.dropoutRisk,
                studentId:       profile.studentId,
                batch:           profile.batch,
                rank,
                skills:          profile.skills || [],
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

// ── Per-batch in-memory cache (keyed by batch year) ──
const _batchStatsCache    = {};
const _batchStatsCachedAt = {};
const BATCH_STATS_TTL     = 5 * 60 * 1000; // 5 minutes

// @desc    Get batch-wide statistics scoped to the student's own batch
// @route   GET /api/students/batch-stats
// @access  Private (Student)
export const getBatchStats = async (req, res) => {
    try {
        // Identify the student's batch
        const profile = await StudentProfile.findOne({ user: req.user.id }, 'batch');
        if (!profile) {
            return res.status(404).json({ success: false, message: 'Profile not found' });
        }
        const batchKey = profile.batch || 'all';

        // Serve from per-batch cache if still fresh
        if (_batchStatsCache[batchKey] && Date.now() - _batchStatsCachedAt[batchKey] < BATCH_STATS_TTL) {
            return res.status(200).json({ success: true, data: _batchStatsCache[batchKey] });
        }

        // Query ONLY this student's batch
        const batchFilter  = batchKey !== 'all' ? { batch: batchKey } : {};
        const allProfiles  = await StudentProfile.find(batchFilter, 'gpa attendance academicHistory');
        const total        = allProfiles.length;

        if (total === 0) {
            return res.status(200).json({ success: true, data: { total: 0, batchCgpa: 0, batchAttendance: 0, semesterAverages: [], cgpaDistribution: [] } });
        }

        // Overall batch CGPA
        const batchCgpa = +(allProfiles.reduce((s, p) => s + (p.gpa || 0), 0) / total).toFixed(2);

        // Overall batch attendance
        const batchAttendance = +(allProfiles.reduce((s, p) => s + (p.attendance || 0), 0) / total).toFixed(1);

        // Per-semester averages
        const semMap = {};
        allProfiles.forEach(p => {
            (p.academicHistory || []).forEach(sem => {
                if (!sem.semester) return;
                if (!semMap[sem.semester]) semMap[sem.semester] = { sum: 0, count: 0 };
                semMap[sem.semester].sum   += sem.gpa || 0;
                semMap[sem.semester].count += 1;
            });
        });
        const semesterAverages = Object.entries(semMap)
            .map(([semester, { sum, count }]) => ({ semester, avg: +(sum / count).toFixed(2) }))
            .sort((a, b) => a.semester.localeCompare(b.semester));

        // CGPA distribution buckets
        const buckets = [
            { label: '<5',  min: 0, max: 5  },
            { label: '5-6', min: 5, max: 6  },
            { label: '6-7', min: 6, max: 7  },
            { label: '7-8', min: 7, max: 8  },
            { label: '8-9', min: 8, max: 9  },
            { label: '9+',  min: 9, max: 11 },
        ];
        const cgpaDistribution = buckets.map(b => ({
            label: b.label,
            count: allProfiles.filter(p => (p.gpa || 0) >= b.min && (p.gpa || 0) < b.max).length,
        }));

        const result = { total, batchCgpa, batchAttendance, semesterAverages, cgpaDistribution, batch: batchKey };

        // Cache per batch
        _batchStatsCache[batchKey]    = result;
        _batchStatsCachedAt[batchKey] = Date.now();

        res.status(200).json({ success: true, data: result });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Temporary cleanup: Remove empty semesters from all profiles
// @route   GET /api/students/cleanup-empty-semesters
// @access  Public (temporary)
export const cleanupEmptySemesters = async (req, res) => {
    try {
        const profiles = await StudentProfile.find({});
        let updatedCount = 0;

        for (const profile of profiles) {
            if (!profile.academicHistory) continue;

            const originalLength = profile.academicHistory.length;
            
            // Filter out any semester that has no subjects
            profile.academicHistory = profile.academicHistory.filter(sem => 
                sem.subjects && sem.subjects.length > 0
            );

            // If we removed something, save the profile
            if (profile.academicHistory.length !== originalLength) {
                await profile.save();
                updatedCount++;
            }
        }

        res.status(200).json({ 
            success: true, 
            message: `Cleaned up empty semesters from ${updatedCount} profiles.` 
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
