import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import StudentProfile from '../models/StudentProfile.js';

// Protect routes — verify JWT and attach user to req
export const protect = async (req, res, next) => {
    let token;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return res.status(401).json({ success: false, message: 'Not authorized to access this route' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Ensure user still exists (handles deleted accounts with live tokens)
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(401).json({ success: false, message: 'User no longer exists' });
        }

        req.user = user;
        next();
    } catch (err) {
        return res.status(401).json({ success: false, message: 'Not authorized to access this route' });
    }
};

// Grant access to specific roles
export const authorize = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: `Access denied. Required role: ${roles.join(' or ')}`,
            });
        }
        next();
    };
};

// Ensure a student can only access their OWN profile
// Usage: router.get('/profile/:studentId', protect, authorize('student'), checkOwnership)
export const checkOwnership = async (req, res, next) => {
    try {
        // Admins bypass ownership check
        if (req.user.role === 'admin') return next();

        const profile = await StudentProfile.findOne({ user: req.user._id });
        if (!profile) {
            return res.status(404).json({ success: false, message: 'Profile not found' });
        }

        // If a specific studentId is requested, ensure it matches the logged-in student
        if (req.params.studentId && req.params.studentId !== profile.studentId) {
            return res.status(403).json({ success: false, message: 'Access denied. You can only view your own profile.' });
        }

        req.studentProfile = profile; // Attach for downstream use
        next();
    } catch (err) {
        res.status(500).json({ success: false, message: err.message });
    }
};
