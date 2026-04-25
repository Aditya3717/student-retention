import express from 'express';
import multer from 'multer';
import { protect, authorize } from '../middleware/authMiddleware.js';
import { getModelStatus, trainSynthetic, trainFromCSV, runBulkPredictions, predictSingle } from '../controllers/mlController.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024 } });

router.use(protect);
router.use(authorize('admin'));

router.get('/status', getModelStatus);
router.post('/train-synthetic', trainSynthetic);
router.post('/train-csv', upload.single('file'), trainFromCSV);
router.post('/run-predictions', runBulkPredictions);
router.post('/predict', predictSingle);

export default router;
