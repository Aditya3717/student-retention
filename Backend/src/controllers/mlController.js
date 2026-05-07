import axios from 'axios';
import StudentProfile from '../models/StudentProfile.js';

const ML_SERVICE_URL = process.env.ML_SERVICE_URL || 'http://localhost:8000';

// @desc    Get ML model status and metrics
// @route   GET /api/ml/status
// @access  Private (Admin)
export const getModelStatus = async (req, res) => {
    try {
        const response = await axios.get(`${ML_SERVICE_URL}/ml/status`, { timeout: 5000 });
        res.status(200).json({ success: true, data: response.data });
    } catch (error) {
        if (error.code === 'ECONNREFUSED' || error.code === 'ETIMEDOUT') {
            return res.status(503).json({ success: false, message: 'ML service is offline. Please start the Python server.' });
        }
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Train model on synthetic data
// @route   POST /api/ml/train-synthetic
// @access  Private (Admin)
export const trainSynthetic = async (req, res) => {
    try {
        const { model_type = 'random_forest', n_samples = 5000 } = req.body;
        const response = await axios.post(`${ML_SERVICE_URL}/ml/train`, { model_type, n_samples }, { timeout: 120000 });
        res.status(200).json({ success: true, data: response.data });
    } catch (error) {
        if (error.code === 'ECONNREFUSED') {
            return res.status(503).json({ success: false, message: 'ML service is offline.' });
        }
        res.status(500).json({ success: false, message: error.response?.data?.detail || error.message });
    }
};

// @desc    Train model from uploaded CSV
// @route   POST /api/ml/train-csv
// @access  Private (Admin)
export const trainFromCSV = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No file uploaded.' });
        }

        const FormData = (await import('form-data')).default;
        const form = new FormData();
        form.append('file', req.file.buffer, {
            filename: req.file.originalname,
            contentType: req.file.mimetype,
        });

        const model_type = req.body.model_type || 'random_forest';
        const response = await axios.post(
            `${ML_SERVICE_URL}/ml/train-csv?model_type=${model_type}`,
            form,
            { headers: form.getHeaders(), timeout: 120000 }
        );

        res.status(200).json({ success: true, data: response.data });
    } catch (error) {
        if (error.code === 'ECONNREFUSED') {
            return res.status(503).json({ success: false, message: 'ML service is offline.' });
        }
        res.status(500).json({ success: false, message: error.response?.data?.detail || error.message });
    }
};

// @desc    Run ML predictions on all students and update their profiles
//          Predictions are saved to StudentProfile.dropoutRisk
//          Visible in: Admin → At-Risk Students page & Student Portal → Risk card
//          Processes in chunks of 500 to handle 17,000+ students safely
// @route   POST /api/ml/run-predictions
// @access  Private (Admin)
export const runBulkPredictions = async (req, res) => {
    try {
        const CHUNK_SIZE = 500;  // Process 500 students per ML call — safe for any size dataset

        // Optional: filter by a specific batch (e.g. ?batch=2025)
        const batchFilter = req.query.batch ? { batch: req.query.batch } : {};

        const totalCount = await StudentProfile.countDocuments(batchFilter);

        if (totalCount === 0) {
            return res.status(200).json({ success: true, message: 'No student profiles found.', updated: 0 });
        }

        let totalUpdated = 0;
        let totalChunks  = Math.ceil(totalCount / CHUNK_SIZE);
        let chunksDone   = 0;

        // Process one chunk at a time using skip/limit — never loads all data into RAM at once
        for (let skip = 0; skip < totalCount; skip += CHUNK_SIZE) {
            const profiles = await StudentProfile.find(batchFilter)
                .skip(skip)
                .limit(CHUNK_SIZE)
                .populate('user', 'name email')
                .lean();   // lean() = plain JS objects = much less memory

            if (profiles.length === 0) break;

            // Build CGPA payload for this chunk
            const studentDataArray = profiles.map(p => {
                const semGpas = (p.academicHistory || []).map(h => h.gpa).filter(g => g > 0);
                const effectiveCgpa = (p.gpa && p.gpa > 0)
                    ? p.gpa
                    : semGpas.length > 0 ? semGpas.reduce((a, b) => a + b, 0) / semGpas.length : 0;

                const creditsEarned = (p.academicHistory || []).reduce(
                    (acc, h) => acc + (h.subjects || []).reduce((s, sub) => s + (sub.credits || 0), 0), 0
                ) || 120;

                const prevSemCgpa = semGpas.length >= 2 ? semGpas[semGpas.length - 2] : effectiveCgpa;

                return {
                    cgpa:                   effectiveCgpa,
                    attendance:             p.attendance || 0,
                    credits_earned:         creditsEarned,
                    extracurricular_score:  50,
                    previous_semester_cgpa: prevSemCgpa,
                };
            });

            const student_ids = profiles.map(p => p._id.toString());

            // Send this chunk to ML service
            const mlResponse = await axios.post(`${ML_SERVICE_URL}/ml/predict-bulk`, {
                students: studentDataArray,
                student_ids,
            }, { timeout: 60000 });

            const predictions = mlResponse.data.predictions;

            // Write DB updates for this chunk in parallel
            const updates = predictions.map(async (pred) => {
                const profile = profiles.find(p => p._id.toString() === pred.student_id);
                if (!profile) return;

                const attendance = profile.attendance || 0;
                const reasonMap = {
                    High:   attendance < 70 ? 'Critical Attendance' : 'Critical CGPA',
                    Medium: attendance < 80 ? 'Low Engagement'      : 'Academic Warning',
                    Low:    'Steady Performance',
                };

                return StudentProfile.findByIdAndUpdate(pred.student_id, {
                    dropoutRisk: {
                        score:    pred.risk_score,
                        category: pred.category,
                        reason:   reasonMap[pred.category] || 'Assessed by ML',
                    }
                });
            });

            await Promise.all(updates);
            totalUpdated += predictions.length;
            chunksDone++;

            console.log(`[ML Bulk] Chunk ${chunksDone}/${totalChunks} done — ${totalUpdated}/${totalCount} students processed`);
        }

        res.status(200).json({
            success:          true,
            message:          `ML predictions applied to ${totalUpdated} students in ${chunksDone} chunks.`,
            updated:          totalUpdated,
            total_in_db:      totalCount,
            chunks_processed: chunksDone,
            chunk_size:       CHUNK_SIZE,
        });
    } catch (error) {
        if (error.code === 'ECONNREFUSED') {
            return res.status(503).json({ success: false, message: 'ML service is offline.' });
        }
        res.status(500).json({ success: false, message: error.response?.data?.detail || error.message });
    }
};

// @desc    Predict risk for a single student data point
// @route   POST /api/ml/predict
// @access  Private (Admin)
export const predictSingle = async (req, res) => {
    try {
        // Accept both `cgpa` and legacy `gpa` field names from callers
        const cgpa               = req.body.cgpa ?? req.body.gpa ?? 0;
        const attendance         = req.body.attendance ?? 0;
        const credits_earned     = req.body.credits_earned ?? 120;
        const extracurricular_score = req.body.extracurricular_score ?? 50;
        const previous_semester_cgpa = req.body.previous_semester_cgpa ?? req.body.previous_semester_gpa ?? cgpa;

        const response = await axios.post(`${ML_SERVICE_URL}/ml/predict-risk`, {
            cgpa,
            attendance,
            credits_earned,
            extracurricular_score,
            previous_semester_cgpa,
        }, { timeout: 10000 });

        res.status(200).json({ success: true, data: response.data });
    } catch (error) {
        if (error.code === 'ECONNREFUSED') {
            return res.status(503).json({ success: false, message: 'ML service is offline.' });
        }
        res.status(500).json({ success: false, message: error.response?.data?.detail || error.message });
    }
};
