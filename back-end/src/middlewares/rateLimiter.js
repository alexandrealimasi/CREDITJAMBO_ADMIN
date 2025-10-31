import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
dotenv.config();

export const generalLimiter = rateLimit({
  windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS ?? '60000'),
  max: parseInt(process.env.RATE_LIMIT_MAX ?? '100'),
  standardHeaders: true,
  legacyHeaders: false,
});
