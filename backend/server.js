import express from 'express';
import dotenv from 'dotenv';
import helmet from 'helmet';
import cors from 'cors';

// Route modules
import authRoutes from './src/routes/auth.js';
import visitRoutes from './src/routes/visits.js';
// Middleware
import { globalLimiter, authLimiter } from './src/middleware/rateLimiter.js';
// DB config
import { connectDB } from './src/config/db.js';

// Load environment variables 
dotenv.config();

const app = express();

// Add standard security headers
app.use(helmet());

// Allow requests from local dev frontends; default to echoing any origin in dev
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow same-origin or tools that omit origin (mobile apps, curl, file://)
      if (!origin) return callback(null, true);

      const allowlist = [
        'http://localhost:3000',
        'http://127.0.0.1:3000',
        'http://localhost:5500',
        'http://127.0.0.1:5500',
        'http://localhost',
      ];

      if (allowlist.includes(origin)) {
        return callback(null, true);
      }

      // In dev, be permissive so static-file previews (file://) or other ports work
      if (process.env.NODE_ENV !== 'production') {
        return callback(null, true);
      }

      return callback(new Error('CORS not allowed'), false);
    },
  })
);

// Parse incoming JSON bodies (for login, register, schedule visit, etc.)
app.use(express.json());

// Apply middlewares and routes
app.use(globalLimiter);
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/visits', visitRoutes);

// Simple health‑check endpoint
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'Villa API running' });
});

// Server configuration
const PORT = process.env.PORT || 5000;

// Connect to MongoDB, then start the HTTP server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`\n🚀 Server running on:`);
    console.log(`   http://localhost:${PORT}`);
    console.log(`   http://127.0.0.1:${PORT}\n`);
  });
});
