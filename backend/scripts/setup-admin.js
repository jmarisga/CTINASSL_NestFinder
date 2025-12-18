/**
 * Admin Setup Script
 * Run this script once to create the first admin user
 * 
 * Usage: node scripts/setup-admin.js
 */

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import readline from 'readline';

// Load environment variables
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '..', '.env') });

// Connect to MongoDB
async function connectDB() {
  const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/nestfinder';
  
  try {
    await mongoose.connect(MONGO_URI, { autoIndex: true });
    console.log('✅ Connected to MongoDB');
  } catch (err) {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  }
}

// User Schema (same as main app)
const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    passwordHash: { type: String, required: true },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
  },
  { timestamps: true }
);

const User = mongoose.model('User', userSchema);

// Create readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(prompt) {
  return new Promise(resolve => rl.question(prompt, resolve));
}

async function main() {
  console.log('\n🏠 NestFinder Admin Setup\n');
  console.log('========================\n');

  await connectDB();

  // Check if admin exists
  const existingAdmin = await User.findOne({ role: 'admin' });
  
  if (existingAdmin) {
    console.log('⚠️  An admin user already exists:');
    console.log(`   Email: ${existingAdmin.email}`);
    console.log(`   Name: ${existingAdmin.name}`);
    
    const proceed = await question('\nCreate another admin? (y/N): ');
    if (proceed.toLowerCase() !== 'y') {
      console.log('Setup cancelled.');
      process.exit(0);
    }
  }

  // Get admin details
  const name = await question('Admin Name: ');
  const email = await question('Admin Email: ');
  const password = await question('Admin Password (min 8 chars): ');

  // Validate
  if (!name || !email || !password) {
    console.error('❌ All fields are required');
    process.exit(1);
  }

  if (password.length < 8) {
    console.error('❌ Password must be at least 8 characters');
    process.exit(1);
  }

  // Check if email exists
  const existingUser = await User.findOne({ email: email.toLowerCase() });
  if (existingUser) {
    console.error('❌ This email is already registered');
    process.exit(1);
  }

  // Create admin
  try {
    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    const admin = await User.create({
      name,
      email: email.toLowerCase(),
      passwordHash,
      role: 'admin',
    });

    console.log('\n✅ Admin user created successfully!');
    console.log(`   ID: ${admin._id}`);
    console.log(`   Name: ${admin.name}`);
    console.log(`   Email: ${admin.email}`);
    console.log(`   Role: ${admin.role}`);
    console.log('\n🔐 You can now login at: /admin/admin-login.html\n');

  } catch (err) {
    console.error('❌ Error creating admin:', err.message);
    process.exit(1);
  }

  process.exit(0);
}

main().catch(console.error).finally(() => rl.close());
