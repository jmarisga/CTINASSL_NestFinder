import express from 'express';
import dotenv from 'dotenv';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';

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
import HTTPSConfig from './src/config/https.js';

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

// 1. Disable server fingerprinting
app.disable('x-powered-by');

// 2. Enhanced security headers with helmet
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      fontSrc: ["'self'", "https://fonts.googleapis.com", "https://fonts.gstatic.com"],
      connectSrc: ["'self'"],
      frameAncestors: ["'none'"],
      formAction: ["'self'"],
      baseUri: ["'self'"],
      upgradeInsecureRequests: []
    }
  },
  xFrameOptions: { action: 'deny' },
  xContentTypeOptions: true,
  xXssProtection: { mode: 'block' },
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}));

// 3. Cache control headers based on path
app.use((req, res, next) => {
  // No cache for sensitive pages
  if (req.path.includes('/admin') || req.path.includes('/api/auth')) {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
  }
  // Short cache for dynamic content
  else if (req.path.includes('/api')) {
    res.set('Cache-Control', 'public, max-age=300'); // 5 minutes
  }
  // Default cache
  else {
    res.set('Cache-Control', 'public, max-age=3600'); // 1 hour
  }
  next();
});

// 4. CORS with restricted origins
app.use(
  cors({
    origin: (origin, callback) => {
      // Production allowed origins from environment
      const allowlist = process.env.ALLOWED_ORIGINS 
        ? process.env.ALLOWED_ORIGINS.split(',')
        : [
            'http://localhost:3000',
            'http://127.0.0.1:3000',
            'http://localhost:5500',
            'http://127.0.0.1:5500',
            'http://localhost',
          ];

      // Allow same-origin or tools that omit origin (mobile apps, curl)
      if (!origin) return callback(null, true);

      if (allowlist.includes(origin)) {
        return callback(null, true);
      }

      // In dev, be permissive
      if (process.env.NODE_ENV !== 'production') {
        return callback(null, true);
      }

      return callback(new Error('CORS not allowed'), false);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

// Parse incoming JSON bodies (for login, register, schedule visit, etc.)
app.use(express.json());

// 5. Secure cookie configuration
app.use((req, res, next) => {
  const originalSend = res.send;
  res.send = function(data) {
    res.set('Set-Cookie', `sessionId=${req.sessionID || ''}; Path=/; HttpOnly; SameSite=Strict; ${process.env.NODE_ENV === 'production' ? 'Secure;' : ''}`);
    res.set('Content-Type', 'application/json; charset=utf-8');
    originalSend.call(this, data);
  };
  next();
});

// Apply middlewares and routes
app.use(globalLimiter);
app.use(HTTPSConfig.redirectHTTPtoHTTPS());
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/visits', visitRoutes);
app.use('/api/admin', authLimiter, adminRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/contacts', contactRoutes);

// 6. robots.txt endpoint
app.get('/robots.txt', (req, res) => {
  res.type('text/plain');
  res.send(`User-agent: *
Disallow: /admin/
Disallow: /api/
Disallow: /.git/
Disallow: /.env
Allow: /`);
});

// Simple health-check endpoint
app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'Villa API running' });
});

// 7. Error handling - hide sensitive information
app.use((err, req, res, next) => {
  console.error(err.stack); // Log full error server-side
  
  if (process.env.NODE_ENV === 'production') {
    res.status(500).json({
      error: 'Internal Server Error',
      message: 'An unexpected error occurred'
    });
  } else {
    res.status(500).json({
      error: err.message,
      stack: err.stack
    });
  }
});

// Server configuration
const PORT = process.env.PORT || 5000;

// Connect to MongoDB, then start the server (HTTP in dev, HTTPS in prod)
connectDB().then(() => {
  const server = HTTPSConfig.createServer(app);
  server.listen(PORT, () => {
    const protocol = process.env.NODE_ENV === 'production' ? 'https' : 'http';
    console.log('\n🚀 Server running on:');
    console.log(`${protocol}://localhost:${PORT}`);
    console.log(`${protocol}://127.0.0.1:${PORT}\n`);
  });
});
