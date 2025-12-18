import express from 'express';
import Property from '../models/Property.js';

const router = express.Router();

// Get all available properties (public)
router.get('/', async (req, res) => {
  try {
    const { type, status, featured, search, limit = 50 } = req.query;

    const filter = {};

    if (type) filter.type = type;
    if (status) filter.status = status;
    if (featured === 'true') filter.featured = true;

    let query = Property.find(filter);

    if (search) {
      query = Property.find({
        ...filter,
        $text: { $search: search },
      });
    }

    const properties = await query
      .limit(parseInt(limit))
      .sort({ createdAt: -1 });

    res.json(properties);
  } catch (err) {
    console.error('Get properties error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single property by ID (public)
router.get('/:id', async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    res.json(property);
  } catch (err) {
    console.error('Get property error:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
