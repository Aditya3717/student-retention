import User from '../models/User.js';
import StudentProfile from '../models/StudentProfile.js';

// @desc    Get all students with profiles
// @route   GET /api/admin/students
// @access  Private (Admin)
export const getAllStudents = async (req, res) => {
    try {
        const page   = parseInt(req.query.page, 10) || 1;
        const limit  = req.query.limit === 'all' ? 'all' : (parseInt(req.query.limit, 10) || 50);
        const search = req.query.search || '';
        const batch  = req.query.batch  || '';   // e.g. "123" for 2023 batch prefix
        const risk   = req.query.risk   || '';   // "High" | "Medium" | "Low"

        let query = {};

        // ── Name / ID search ──
        if (search) {
            const matchingUsers = await User.find({ name: { $regex: search, $options: 'i' } }).select('_id');
            const userIds = matchingUsers.map(u => u._id);
            query.$or = [
                { studentId: { $regex: search, $options: 'i' } },
                { user: { $in: userIds } }
            ];
        }

        // ── Batch prefix filter (first N chars of studentId) ──
        if (batch) {
            query.studentId = { $regex: `^${batch}`, $options: 'i' };
        }

        // ── Risk category filter ──
        if (risk) {
            query['dropoutRisk.category'] = risk;
        }

        let studentsQuery = StudentProfile.find(query).populate('user', 'name email').sort({ 'dropoutRisk.score': -1 });

        if (limit === 'all') {
            const students = await studentsQuery;
            return res.status(200).json({ success: true, count: students.length, data: students });
        } else {
            const total    = await StudentProfile.countDocuments(query);
            const students = await studentsQuery.skip((page - 1) * limit).limit(limit);
            return res.status(200).json({
                success: true, count: students.length, total,
                page, pages: Math.ceil(total / limit), data: students
            });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get distinct batches from StudentProfile.batch field
// @route   GET /api/admin/batches
// @access  Private (Admin)
export const getDistinctBatches = async (req, res) => {
    try {
        // Use the real batch field — distinct values, sorted descending (newest first)
        const batches = await StudentProfile.distinct('batch');
        const sorted  = batches.filter(Boolean).sort((a, b) => b.localeCompare(a));
        res.status(200).json({ success: true, data: sorted });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};


// @desc    Get dashboard aggregated stats
// @route   GET /api/admin/dashboard-stats
// @access  Private (Admin)
export const getDashboardStats = async (req, res) => {
    try {
        const batchFilter   = req.query.batch ? { batch: req.query.batch } : {};
        const totalStudents = await StudentProfile.countDocuments(batchFilter);
        
        const distribution = { High: 0, Medium: 0, Low: 0 };
        const atRiskStats = await StudentProfile.aggregate([
            { $match: batchFilter },
            { $group: { _id: '$dropoutRisk.category', count: { $sum: 1 } } }
        ]);
        atRiskStats.forEach(stat => {
            if (stat._id) distribution[stat._id] = stat.count;
        });

        const avgData = await StudentProfile.aggregate([
            { $match: batchFilter },
            { $group: { _id: null, avgAtt: { $avg: '$attendance' }, avgGpa: { $avg: '$gpa' } } }
        ]);
        const avgAttendance = avgData.length > 0 ? +avgData[0].avgAtt.toFixed(1) : 0;
        const avgGpa        = avgData.length > 0 ? +avgData[0].avgGpa.toFixed(2) : 0;

        // 10-point CGPA scale buckets: <5, 5-6, 6-7, 7-8, 8-9, 9-10
        const cgpaBuckets = [0, 0, 0, 0, 0, 0];
        const gpaData = await StudentProfile.aggregate([
            { $match: batchFilter },
            {
                $bucket: {
                    groupBy: '$gpa',
                    boundaries: [0, 5, 6, 7, 8, 9, 10.1],
                    default: 'Other',
                    output: { count: { $sum: 1 } }
                }
            }
        ]);
        const bucketMap = { 0: 0, 5: 1, 6: 2, 7: 3, 8: 4, 9: 5 };
        gpaData.forEach(b => {
            if (bucketMap[b._id] !== undefined) cgpaBuckets[bucketMap[b._id]] = b.count;
        });

        res.status(200).json({
            success: true,
            data: {
                totalStudents,
                atRisk:      distribution['High']   || 0,
                mediumRisk:  distribution['Medium'] || 0,
                avgAttendance,
                avgGpa,
                batch: req.query.batch || 'all',
                distribution: [
                    distribution['High']   || 0,
                    distribution['Medium'] || 0,
                    distribution['Low']    || 0
                ],
                gpaDistribution: cgpaBuckets,
                gpaLabels: ['< 5', '5-6', '6-7', '7-8', '8-9', '9-10']
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get at-risk students
// @route   GET /api/admin/at-risk
// @access  Private (Admin)
export const getAtRiskStudents = async (req, res) => {
    try {
        const query = { 'dropoutRisk.category': { $in: ['Medium', 'High'] } };
        if (req.query.batch) query.batch = req.query.batch;

        const atRisk = await StudentProfile.find(query).populate('user', 'name email');

        res.status(200).json({ success: true, count: atRisk.length, data: atRisk });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
// @desc    Recalculate risk for all students
// @route   POST /api/admin/recalculate-risk
// @access  Private (Admin)
export const recalculateRisk = async (req, res) => {
    try {
        const students = await StudentProfile.find();
        const updates = students.map(async (s) => {
            // Derive effective CGPA: use root field if set, else average semester TGPAs
            const semGpas = (s.academicHistory || []).map(h => h.gpa).filter(g => g > 0);
            const effectiveCgpa = (s.gpa && s.gpa > 0)
                ? s.gpa
                : semGpas.length > 0
                    ? semGpas.reduce((a, b) => a + b, 0) / semGpas.length
                    : 0;

            // 10-point CGPA scale: CGPA contributes 60%, attendance 40%
            const gpaComponent        = (effectiveCgpa / 10) * 60;
            const attendanceComponent = (s.attendance / 100) * 40;
            const riskScore = Math.max(0, Math.min(100, 100 - (gpaComponent + attendanceComponent)));

            let category = 'Low';
            let reason   = 'Steady performance';

            if (riskScore > 65) {
                category = 'High';
                reason   = s.attendance < 70 ? 'Critical Attendance' : 'Critical CGPA';
            } else if (riskScore > 40) {
                category = 'Medium';
                reason   = s.attendance < 80 ? 'Low Engagement' : 'Academic Warning';
            }

            s.dropoutRisk = { score: Math.round(riskScore), category, reason };
            return s.save();
        });

        await Promise.all(updates);
        res.status(200).json({ success: true, message: 'Risk scores updated successfully' });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Create new admin
// @route   POST /api/admin/create-admin
// @access  Private (Admin)
export const createAdmin = async (req, res) => {
    try {
        const { name, email, password, registrationNumber } = req.body;

        // Check if user exists
        const userExists = await User.findOne({ 
            $or: [
                { email }, 
                { registrationNumber: registrationNumber || '___non_existent___' }
            ] 
        });

        if (userExists) {
            return res.status(400).json({ success: false, message: 'Admin already exists with this email or ID' });
        }

        const admin = await User.create({
            name,
            email,
            password,
            role: 'admin',
            registrationNumber,
            verificationStatus: 'approved'
        });

        res.status(201).json({
            success: true,
            message: 'New admin created successfully',
            data: {
                id: admin._id,
                name: admin.name,
                email: admin.email,
                role: admin.role,
                registrationNumber: admin.registrationNumber
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get all admins
// @route   GET /api/admin/team
// @access  Private (Admin)
export const getAllAdmins = async (req, res) => {
    try {
        const admins = await User.find({ role: 'admin' }).select('-password');
        res.status(200).json({ success: true, count: admins.length, data: admins });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Update student profile (GPA/Attendance)
// @route   PUT /api/admin/students/:id
// @access  Private (Admin)
export const updateStudentProfile = async (req, res) => {
    try {
        const { gpa, attendance } = req.body;
        const profile = await StudentProfile.findById(req.params.id);

        if (!profile) {
            return res.status(404).json({ success: false, message: 'Profile not found' });
        }

        if (gpa !== undefined) profile.gpa = gpa;
        if (attendance !== undefined) profile.attendance = attendance;

        // 10-point CGPA scale
        const gpaComponent        = (profile.gpa / 10) * 60;
        const attendanceComponent = (profile.attendance / 100) * 40;
        const riskScore = Math.max(0, Math.min(100, 100 - (gpaComponent + attendanceComponent)));

        let category = 'Low';
        let reason   = 'Steady performance';

        if (riskScore > 65) {
            category = 'High';
            reason   = profile.attendance < 70 ? 'Critical Attendance' : 'Critical CGPA';
        } else if (riskScore > 40) {
            category = 'Medium';
            reason   = profile.attendance < 80 ? 'Low Engagement' : 'Academic Warning';
        }

        profile.dropoutRisk = { score: Math.round(riskScore), category, reason };
        await profile.save();

        res.status(200).json({ success: true, data: profile });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Create new student
// @route   POST /api/admin/students
// @access  Private (Admin)
export const createStudent = async (req, res) => {
    try {
        const { name, email, password, registrationNumber, gpa, attendance, batch } = req.body;

        const userExists = await User.findOne({ 
            $or: [
                { email }, 
                { registrationNumber: registrationNumber || '___non_existent___' }
            ] 
        });

        if (userExists) {
            return res.status(400).json({ success: false, message: 'Student already exists with this email or ID' });
        }

        const student = await User.create({
            name,
            email,
            password,
            role: 'student',
            registrationNumber,
            batch: batch || null,
            verificationStatus: 'approved'
        });

        // 10-point CGPA scale
        const gpaComponent        = ((gpa || 0) / 10) * 60;
        const attendanceComponent = ((attendance || 0) / 100) * 40;
        const riskScore = Math.max(0, Math.min(100, 100 - (gpaComponent + attendanceComponent)));

        let category = 'Low';
        let reason   = 'Steady performance';

        if (riskScore > 65) {
            category = 'High';
            reason   = (attendance || 0) < 70 ? 'Critical Attendance' : 'Critical CGPA';
        } else if (riskScore > 40) {
            category = 'Medium';
            reason   = (attendance || 0) < 80 ? 'Low Engagement' : 'Academic Warning';
        }

        const profile = await StudentProfile.create({
            user:       student._id,
            studentId:  registrationNumber,
            batch:      batch || 'unassigned',
            gpa:        gpa || 0,
            attendance: attendance || 0,
            dropoutRisk: { score: Math.round(riskScore), category, reason }
        });

        res.status(201).json({
            success: true,
            message: 'New student created successfully',
            data: profile
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get pending student verifications
// @route   GET /api/admin/pending-verifications
// @access  Private (Admin)
export const getPendingVerifications = async (req, res) => {
    try {
        const pendingUsers = await User.find({ role: 'student', verificationStatus: 'pending' }).select('-password');
        res.status(200).json({ success: true, count: pendingUsers.length, data: pendingUsers });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Verify or reject a student
// @route   PUT /api/admin/verify-student/:id
// @access  Private (Admin)
export const verifyStudent = async (req, res) => {
    try {
        const { status } = req.body; // 'approved' or 'rejected'
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        user.verificationStatus = status;
        await user.save();

        if (status === 'approved') {
            // Create a blank profile if it doesn't exist
            const profileExists = await StudentProfile.findOne({ user: user._id });
            if (!profileExists) {
                await StudentProfile.create({
                    user:       user._id,
                    studentId:  user.registrationNumber || `STU-${Math.floor(Math.random() * 10000)}`,
                    batch:      user.batch || 'unassigned',
                    gpa:        0,
                    attendance: 0,
                    dropoutRisk: { score: 0, category: 'Low', reason: 'New Registration' }
                });
            }
        } else if (status === 'rejected') {
            // Optionally delete the user if rejected
            await User.findByIdAndDelete(user._id);
        }

        res.status(200).json({ success: true, message: `Student ${status} successfully` });
    } catch (error) {
        console.error('Verify Student Error:', error);
        res.status(500).json({ success: false, message: error.message });
    }
};

