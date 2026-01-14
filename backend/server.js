import express from 'express';
import dotenv from 'dotenv';
import helmet from 'helmet';
import cors from 'cors';

// Route modules
import authRoutes from './src/routes/auth.js';
import visitRoutes from './src/routes/visits.js';
import adminRoutes from './src/routes/admin.js';
import propertyRoutes from './src/routes/properties.js';
import contactRoutes from './src/routes/contacts.js';
// Middleware
import { globalLimiter, authLimiter } from './src/middleware/rateLimiter.js';
// DB config
import { connectDB } from './src/config/db.js';

// Load environment variables 
dotenv.config();

// Validate required environment variables
if (!process.env.MONGO_URI) {
  console.error('❌ Error: MONGO_URI environment variable is required');
  console.error('Please create a .env file with: MONGO_URI=mongodb://127.0.0.1:27017/villa');
  process.exit(1);
}

if (!process.env.JWT_SECRET) {
  console.error('❌ Error: JWT_SECRET environment variable is required');
  console.error('Please create a .env file with: JWT_SECRET=yoursecretkeyhere');
  process.exit(1);
}

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
app.use('/api/admin', authLimiter, adminRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/contacts', contactRoutes);

// Simple health‑check endpoint
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'Villa API running' });
});

// Server configuration
const PORT = process.env.PORT || 5000;

// Connect to MongoDB, then start the HTTP server
connectDB().then(() => {
  app.listen(PORT, () => {
    console.log('\n🚀 Server running on:');
    console.log(`http://localhost:${PORT}`);
    console.log(`http://127.0.0.1:${PORT}\n`);
  });
});
