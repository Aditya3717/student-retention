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
// @desc    Recalculate risk for all students
// @route   POST /api/admin/recalculate-risk
// @access  Private (Admin)
export const recalculateRisk = async (req, res) => {
    try {
        const students = await StudentProfile.find();
        const updates = students.map(async (s) => {
            // Rule-based logic similar to ML service
            const gpaScore = s.gpa * 15;
            const attendanceScore = s.attendance * 0.5;
            const riskScore = Math.max(0, Math.min(100, 100 - (gpaScore + attendanceScore)));

            let category = 'Low';
            let reason = 'Steady performance';

            if (riskScore > 70) {
                category = 'High';
                reason = s.attendance < 75 ? 'Critical Attendance' : 'Critical GPA';
            } else if (riskScore > 35) {
                category = 'Medium';
                reason = s.attendance < 85 ? 'Low Engagement' : 'Academic Warning';
            }

            s.dropoutRisk = {
                score: Math.round(riskScore),
                category,
                reason
            };
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

        // Auto-recalculate risk after update
        const gpaScore = profile.gpa * 15;
        const attendanceScore = profile.attendance * 0.5;
        const riskScore = Math.max(0, Math.min(100, 100 - (gpaScore + attendanceScore)));

        let category = 'Low';
        let reason = 'Steady performance';

        if (riskScore > 70) {
            category = 'High';
            reason = profile.attendance < 75 ? 'Critical Attendance' : 'Critical GPA';
        } else if (riskScore > 35) {
            category = 'Medium';
            reason = profile.attendance < 85 ? 'Low Engagement' : 'Academic Warning';
        }

        profile.dropoutRisk = {
            score: Math.round(riskScore),
            category,
            reason
        };

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
        const { name, email, password, registrationNumber, gpa, attendance } = req.body;

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
            verificationStatus: 'approved'
        });

        const gpaScore = (gpa || 0) * 15;
        const attendanceScore = (attendance || 0) * 0.5;
        const riskScore = Math.max(0, Math.min(100, 100 - (gpaScore + attendanceScore)));

        let category = 'Low';
        let reason = 'Steady performance';

        if (riskScore > 70) {
            category = 'High';
            reason = (attendance || 0) < 75 ? 'Critical Attendance' : 'Critical GPA';
        } else if (riskScore > 35) {
            category = 'Medium';
            reason = (attendance || 0) < 85 ? 'Low Engagement' : 'Academic Warning';
        }

        const profile = await StudentProfile.create({
            user: student._id,
            studentId: registrationNumber,
            gpa: gpa || 0,
            attendance: attendance || 0,
            dropoutRisk: {
                score: Math.round(riskScore),
                category,
                reason
            }
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
                    user: user._id,
                    studentId: user.registrationNumber || `STU-${Math.floor(Math.random() * 10000)}`,
                    gpa: 0,
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

