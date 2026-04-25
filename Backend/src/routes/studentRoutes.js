import express from 'express';
import { getDashboard, updateSkills, getProfile } from '../controllers/studentController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);
router.use(authorize('student'));

router.get('/dashboard', getDashboard);
router.get('/profile', getProfile);
router.put('/skills', updateSkills);

export default router;
