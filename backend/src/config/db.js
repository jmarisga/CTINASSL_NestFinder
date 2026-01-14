import mongoose from 'mongoose';
import dns from 'dns';

// Force Node.js to use Google DNS (8.8.8.8) for DNS resolution
// This fixes macOS DNS issues when system DNS is not configured
dns.setServers(['8.8.8.8', '8.8.4.4']);

export async function connectDB() {
  const MONGO_URI = process.env.MONGO_URI;

  try {
    await mongoose.connect(MONGO_URI, { autoIndex: true });
    console.log('✅ MongoDB connected successfully');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  }
}


