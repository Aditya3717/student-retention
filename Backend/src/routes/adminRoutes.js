import express from 'express';
import { getAllStudents, getAtRiskStudents } from '../controllers/adminController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);
router.use(authorize('admin'));

router.get('/students', getAllStudents);
router.get('/at-risk', getAtRiskStudents);

export default router;
