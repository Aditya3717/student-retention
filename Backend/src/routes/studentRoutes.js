import express from 'express';
import { getDashboard, updateSkills, getProfile, getBatchStats, cleanupEmptySemesters } from '../controllers/studentController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

// Run this route from browser/curl to fix DB: GET /api/students/cleanup
router.get('/cleanup', cleanupEmptySemesters);

router.use(protect);
router.use(authorize('student'));

router.get('/dashboard', getDashboard);
router.get('/profile', getProfile);
router.get('/batch-stats', getBatchStats);
router.put('/skills', updateSkills);

export default router;
