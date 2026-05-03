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
        const { model_type = 'random_forest', n_samples = 1000 } = req.body;
        const response = await axios.post(`${ML_SERVICE_URL}/ml/train`, { model_type, n_samples }, { timeout: 60000 });
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
// @route   POST /api/ml/run-predictions
// @access  Private (Admin)
export const runBulkPredictions = async (req, res) => {
    try {
        const profiles = await StudentProfile.find().populate('user', 'name email');

        if (profiles.length === 0) {
            return res.status(200).json({ success: true, message: 'No student profiles found to predict.', updated: 0 });
        }

        const studentDataArray = profiles.map(p => {
            // Derive effective CGPA from semester history when root field is 0
            const semGpas = (p.academicHistory || []).map(h => h.gpa).filter(g => g > 0);
            const effectiveCgpa = (p.gpa && p.gpa > 0)
                ? p.gpa
                : semGpas.length > 0 ? semGpas.reduce((a, b) => a + b, 0) / semGpas.length : 0;

            // Real credits from academic history
            const creditsEarned = (p.academicHistory || []).reduce(
                (acc, h) => acc + (h.subjects || []).reduce((s, sub) => s + (sub.credits || 0), 0), 0
            ) || 120;

            // Previous semester CGPA (second-to-last semester if available)
            const prevSemGpa = semGpas.length >= 2 ? semGpas[semGpas.length - 2] : effectiveCgpa;

            return {
                gpa: effectiveCgpa,
                attendance: p.attendance || 0,
                credits_earned: creditsEarned,
                extracurricular_score: 50,
                previous_semester_gpa: prevSemGpa,
            };
        });

        const student_ids = profiles.map(p => p._id.toString());

        const mlResponse = await axios.post(`${ML_SERVICE_URL}/ml/predict-bulk`, {
            students: studentDataArray,
            student_ids,
        }, { timeout: 300000 }); // 5 min — handles 8000+ students

        const predictions = mlResponse.data.predictions;

        const updates = predictions.map(async (pred) => {
            const profile = profiles.find(p => p._id.toString() === pred.student_id);
            if (!profile) return;

            const reasonMap = {
                High: profile.attendance < 70 ? 'Critical Attendance' : 'Critical CGPA',
                Medium: profile.attendance < 80 ? 'Low Engagement' : 'Academic Warning',
                Low: 'Steady Performance',
            };

            profile.dropoutRisk = {
                score: pred.risk_score,
                category: pred.category,
                reason: reasonMap[pred.category] || 'Assessed by ML',
            };

            return profile.save();
        });

        await Promise.all(updates);

        res.status(200).json({
            success: true,
            message: `ML predictions applied to ${predictions.length} students.`,
            updated: predictions.length,
            model_used: predictions[0]?.model_used || 'unknown',
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
        const { gpa, attendance, credits_earned, extracurricular_score, previous_semester_gpa } = req.body;
        const response = await axios.post(`${ML_SERVICE_URL}/ml/predict-risk`, {
            gpa, attendance,
            credits_earned: credits_earned || 120,
            extracurricular_score: extracurricular_score || 50,
            previous_semester_gpa: previous_semester_gpa || gpa,
        }, { timeout: 10000 });
        res.status(200).json({ success: true, data: response.data });
    } catch (error) {
        if (error.code === 'ECONNREFUSED') {
            return res.status(503).json({ success: false, message: 'ML service is offline.' });
        }
        res.status(500).json({ success: false, message: error.response?.data?.detail || error.message });
    }
};
