import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Property from '../models/Property.js';
import Visit from '../models/Visit.js';
import Contact from '../models/Contact.js';
import { adminRequired } from '../middleware/authMiddleware.js';

const router = express.Router();

// Helper to generate JWT for admin
function generateAdminToken(user) {
  const payload = {
    sub: user._id.toString(),
    email: user.email,
    role: user.role,
    isAdmin: true,
  };

  return jwt.sign(payload, process.env.JWT_SECRET || 'dev_secret_change_me', {
    expiresIn: '8h',
  });
}

// ADMIN AUTHENTICATION
// Admin Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check if user is admin
    if (user.role !== 'admin') {
      return res.status(403).json({ message: 'Access denied. Admin privileges required.' });
    }

    const passwordMatch = await bcrypt.compare(password, user.passwordHash);
    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateAdminToken(user);

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error('Admin login error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Verify admin token
router.get('/verify', adminRequired, (req, res) => {
  res.json({
    valid: true,
    user: req.user,
  });
});

// DASHBOARD STATS

router.get('/stats', adminRequired, async (req, res) => {
  try {
    const [usersCount, propertiesCount, visitsCount, contactsCount] = await Promise.all([
      User.countDocuments(),
      Property.countDocuments(),
      Visit.countDocuments(),
      Contact.countDocuments(),
    ]);

    res.json({
      users: usersCount,
      properties: propertiesCount,
      visits: visitsCount,
      contacts: contactsCount,
    });
  } catch (err) {
    console.error('Stats error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// =============================================
// USER MANAGEMENT
// =============================================

// Get all users
router.get('/users', adminRequired, async (req, res) => {
  try {
    const users = await User.find()
      .select('-passwordHash')
      .sort({ createdAt: -1 });

    res.json(users);
  } catch (err) {
    console.error('Get users error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single user
router.get('/users/:id', adminRequired, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-passwordHash');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (err) {
    console.error('Get user error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update user role
router.patch('/users/:id/role', adminRequired, async (req, res) => {
  try {
    const { role } = req.body;

    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select('-passwordHash');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (err) {
    console.error('Update user role error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete user
router.delete('/users/:id', adminRequired, async (req, res) => {
  try {
    // Prevent self-deletion
    if (req.user.id === req.params.id) {
      return res.status(400).json({ message: 'Cannot delete your own account' });
    }

    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({ message: 'User deleted successfully' });
  } catch (err) {
    console.error('Delete user error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// =============================================
// PROPERTY MANAGEMENT
// =============================================

// Get all properties
router.get('/properties', adminRequired, async (req, res) => {
  try {
    const properties = await Property.find()
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    res.json(properties);
  } catch (err) {
    console.error('Get properties error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Create property
router.post('/properties', adminRequired, async (req, res) => {
  try {
    const { name, price, bedrooms, bathrooms, area, image, description, location, type, status, featured } = req.body;

    if (!name || !price || bedrooms === undefined || bathrooms === undefined || !area || !image) {
      return res.status(400).json({ message: 'Required fields: name, price, bedrooms, bathrooms, area, image' });
    }

    const property = await Property.create({
      name,
      price,
      bedrooms,
      bathrooms,
      area,
      image,
      description,
      location,
      type,
      status,
      featured,
      createdBy: req.user.id,
    });

    res.status(201).json(property);
  } catch (err) {
    console.error('Create property error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update property
router.put('/properties/:id', adminRequired, async (req, res) => {
  try {
    const { name, price, bedrooms, bathrooms, area, image, description, location, type, status, featured } = req.body;

    const property = await Property.findByIdAndUpdate(
      req.params.id,
      { name, price, bedrooms, bathrooms, area, image, description, location, type, status, featured },
      { new: true, runValidators: true }
    );

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    res.json(property);
  } catch (err) {
    console.error('Update property error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete property
router.delete('/properties/:id', adminRequired, async (req, res) => {
  try {
    const property = await Property.findByIdAndDelete(req.params.id);

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    res.json({ message: 'Property deleted successfully' });
  } catch (err) {
    console.error('Delete property error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// =============================================
// VISIT MANAGEMENT
// =============================================

// Get all visits
router.get('/visits', adminRequired, async (req, res) => {
  try {
    const visits = await Visit.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 });

    // Map visits to include date field for frontend compatibility
    const mappedVisits = visits.map(v => ({
      ...v.toObject(),
      date: v.visitDate,
    }));

    res.json(mappedVisits);
  } catch (err) {
    console.error('Get visits error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete visit
router.delete('/visits/:id', adminRequired, async (req, res) => {
  try {
    const visit = await Visit.findByIdAndDelete(req.params.id);

    if (!visit) {
      return res.status(404).json({ message: 'Visit not found' });
    }

    res.json({ message: 'Visit deleted successfully' });
  } catch (err) {
    console.error('Delete visit error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// =============================================
// CREATE ADMIN USER (First-time setup)
// =============================================

router.post('/setup', async (req, res) => {
  try {
    // Check if any admin exists
    const adminExists = await User.findOne({ role: 'admin' });

    if (adminExists) {
      return res.status(400).json({ message: 'Admin already exists. Setup not allowed.' });
    }

    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email and password are required' });
    }

    if (password.length < 8) {
      return res.status(400).json({ message: 'Password must be at least 8 characters long' });
    }

    const salt = await bcrypt.genSalt(12);
    const passwordHash = await bcrypt.hash(password, salt);

    const admin = await User.create({
      name,
      email: email.toLowerCase(),
      passwordHash,
      role: 'admin',
    });

    res.status(201).json({
      message: 'Admin created successfully',
      user: { id: admin._id, name: admin.name, email: admin.email, role: admin.role },
    });
  } catch (err) {
    console.error('Admin setup error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
