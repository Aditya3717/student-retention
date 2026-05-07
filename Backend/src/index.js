import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import connectDB from './config/db.js';
import { authLimiter, apiLimiter } from './middleware/rateLimiter.js';

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// ── Security: Hardened Helmet headers ──
app.use(helmet({
    crossOriginEmbedderPolicy: false,  // allow frontend to load resources
    contentSecurityPolicy: false,       // disable CSP for API (not serving HTML)
}));

// ── CORS: Only allow known frontend origins ──
const allowedOrigins = [
    'http://localhost:5173',   // Student portal
    'http://localhost:5174',   // Admin portal
    'http://localhost:5175',   // Landing page
    process.env.FRONTEND_URL,  // Production URL (set in .env)
].filter(Boolean);

app.use(cors({
    origin: (origin, callback) => {
        // Allow requests with no origin (Postman, curl, same-origin)
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error(`CORS blocked: ${origin} not allowed`));
        }
    },
    credentials: true,
}));

app.use(express.json({ limit: '10kb' }));  // Prevent large payload attacks
app.use(morgan('dev'));

// ── General API rate limit (applies to all routes) ──
app.use('/api', apiLimiter);

// ── Mount routers ──
import authRoutes    from './routes/authRoutes.js';
import studentRoutes from './routes/studentRoutes.js';
import adminRoutes   from './routes/adminRoutes.js';
import mlRoutes      from './routes/mlRoutes.js';

// Auth routes get a stricter rate limiter (brute-force protection)
app.use('/api/auth',     authLimiter, authRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/admin',    adminRoutes);
app.use('/api/ml',       mlRoutes);

// Health check
app.get('/', (req, res) => {
    res.json({ success: true, message: 'Student Retention System API' });
});

// ── Global error handler ──
app.use((err, req, res, next) => {
    // Handle CORS errors
    if (err.message?.startsWith('CORS blocked')) {
        return res.status(403).json({ success: false, message: err.message });
    }
    console.error(err.stack);
    res.status(500).json({ success: false, message: 'Internal server error' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

