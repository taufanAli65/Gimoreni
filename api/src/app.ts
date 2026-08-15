import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { globalRateLimiter } from './shared/middleware/rateLimit.middleware';
import { errorHandler } from './shared/middleware/errorHandler.middleware';
import { env } from './config/env';

export const app = express();

// Middleware
app.use(globalRateLimiter);
app.use(cors({ origin: env.CLIENT_URL, credentials: true }));
app.use(express.json());
app.use(cookieParser());

// Base Route
app.get('/api/v1/health', (req, res) => {
  res.json({ success: true, data: { status: 'ok', timestamp: new Date() } });
});

// Domain Routers will be mounted here later

// Global Error Handler
app.use(errorHandler);
