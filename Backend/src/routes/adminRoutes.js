import express from 'express';
import { getAllStudents, getAtRiskStudents, recalculateRisk, getAllAdmins, createAdmin, updateStudentProfile, createStudent, getPendingVerifications, verifyStudent } from '../controllers/adminController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);
router.use(authorize('admin'));

router.get('/students', getAllStudents);
router.post('/students', createStudent);
router.put('/students/:id', updateStudentProfile);
router.get('/at-risk', getAtRiskStudents);
router.post('/recalculate-risk', recalculateRisk);
router.get('/pending-verifications', getPendingVerifications);
router.put('/verify-student/:id', verifyStudent);

// Team Management
router.get('/team', getAllAdmins);
router.post('/create-admin', createAdmin);

export default router;
