import rateLimit from 'express-rate-limit';

// Global rate limiter for all routes
export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // each IP can make 100 requests per window
  standardHeaders: true,
  legacyHeaders: false,
});

// Stricter limiter for auth routes (login/register)
export const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50, // Increased for development
  message: 'Too many login attempts, please try again later.',
});


