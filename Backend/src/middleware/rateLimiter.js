import rateLimit from 'express-rate-limit';

// ── Auth routes (login/register) — strict limit ──
// Max 10 attempts per IP per 15 minutes
export const authLimiter = rateLimit({
    windowMs:         15 * 60 * 1000,  // 15 minutes
    max:              10,
    standardHeaders:  true,
    legacyHeaders:    false,
    message: {
        success: false,
        message: 'Too many login attempts from this IP. Please try again after 15 minutes.'
    },
    // Skip successful requests — only count failures
    skipSuccessfulRequests: true,
});

// ── General API — relaxed limit ──
// Max 200 requests per IP per 10 minutes
export const apiLimiter = rateLimit({
    windowMs:         10 * 60 * 1000,  // 10 minutes
    max:              200,
    standardHeaders:  true,
    legacyHeaders:    false,
    message: {
        success: false,
        message: 'Too many requests from this IP. Please slow down.'
    },
});
