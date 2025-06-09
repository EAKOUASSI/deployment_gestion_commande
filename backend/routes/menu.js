import express from 'express';
import { body, validationResult, query } from 'express-validator';
import MenuItem from '../models/MenuItem.js';
import { auth, authorize } from '../middleware/auth.js';

const router = express.Router();

// Get all menu items with filtering and pagination
router.get('/', [
  query('page').optional().isInt({ min: 1 }).withMessage('Page must be a positive integer'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit must be between 1 and 100'),
  query('category').optional().isIn(['appetizers', 'mains', 'desserts', 'beverages']),
  query('available').optional().isBoolean(),
  query('featured').optional().isBoolean(),
  query('minPrice').optional().isFloat({ min: 0 }),
  query('maxPrice').optional().isFloat({ min: 0 }),
  query('spiceLevel').optional().isIn(['mild', 'medium', 'hot']),
  query('dietary').optional().isIn(['vegetarian', 'vegan', 'gluten-free', 'dairy-free', 'halal', 'kosher']),
  query('search').optional().isLength({ min: 1, max: 100 }),
  query('sortBy').optional().isIn(['name', 'price', 'rating', 'createdAt']),
  query('sortOrder').optional().isIn(['asc', 'desc'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      page = 1,
      limit = 20,
      category,
      available,
      featured,
      minPrice,
      maxPrice,
      spiceLevel,
      dietary,
      search,
      sortBy = 'name',
      sortOrder = 'asc'
    } = req.query;

    // Build filter object
    const filter = {};

    if (category) filter.category = category;
    if (available !== undefined) filter.available = available === 'true';
    if (featured !== undefined) filter.featured = featured === 'true';
    if (spiceLevel) filter.spiceLevel = spiceLevel;
    if (dietary) filter.dietary = { $in: [dietary] };

    // Price range filter
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }

    // Text search
    if (search) {
      filter.$text = { $search: search };
    }

    // Build sort object
    const sort = {};
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

    // Execute query with pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const [items, total] = await Promise.all([
      MenuItem.find(filter)
        .sort(sort)
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      MenuItem.countDocuments(filter)
    ]);

    res.json({
      items,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalItems: total,
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Get menu items error:', error);
    res.status(500).json({ message: 'Server error while fetching menu items' });
  }
});

// Get single menu item by ID
router.get('/:id', async (req, res) => {
  try {
    const item = await MenuItem.findById(req.params.id)
      .populate('reviews.user', 'name')
      .lean();

    if (!item) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    res.json(item);
  } catch (error) {
    console.error('Get menu item error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid menu item ID' });
    }
    res.status(500).json({ message: 'Server error while fetching menu item' });
  }
});

// Create new menu item (admin only)
router.post('/', auth, authorize(['admin']), [
  body('name').trim().isLength({ min: 1, max: 100 }).withMessage('Name is required and must be less than 100 characters'),
  body('description').trim().isLength({ min: 1, max: 500 }).withMessage('Description is required and must be less than 500 characters'),
  body('price').isFloat({ min: 0 }).withMessage('Price must be a positive number'),
  body('category').isIn(['appetizers', 'mains', 'desserts', 'beverages']).withMessage('Invalid category'),
  body('image').isURL().withMessage('Image must be a valid URL'),
  body('spiceLevel').optional().isIn(['mild', 'medium', 'hot']),
  body('dietary').optional().isArray(),
  body('dietary.*').optional().isIn(['vegetarian', 'vegan', 'gluten-free', 'dairy-free', 'halal', 'kosher']),
  body('preparationTime').optional().isInt({ min: 1 }),
  body('available').optional().isBoolean(),
  body('featured').optional().isBoolean()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const menuItem = new MenuItem(req.body);
    await menuItem.save();

    res.status(201).json({
      message: 'Menu item created successfully',
      item: menuItem
    });
  } catch (error) {
    console.error('Create menu item error:', error);
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Menu item with this name already exists' });
    }
    res.status(500).json({ message: 'Server error while creating menu item' });
  }
});

// Update menu item (admin only)
router.put('/:id', auth, authorize(['admin']), [
  body('name').optional().trim().isLength({ min: 1, max: 100 }),
  body('description').optional().trim().isLength({ min: 1, max: 500 }),
  body('price').optional().isFloat({ min: 0 }),
  body('category').optional().isIn(['appetizers', 'mains', 'desserts', 'beverages']),
  body('image').optional().isURL(),
  body('spiceLevel').optional().isIn(['mild', 'medium', 'hot']),
  body('dietary').optional().isArray(),
  body('dietary.*').optional().isIn(['vegetarian', 'vegan', 'gluten-free', 'dairy-free', 'halal', 'kosher']),
  body('preparationTime').optional().isInt({ min: 1 }),
  body('available').optional().isBoolean(),
  body('featured').optional().isBoolean()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const item = await MenuItem.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!item) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    res.json({
      message: 'Menu item updated successfully',
      item
    });
  } catch (error) {
    console.error('Update menu item error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid menu item ID' });
    }
    res.status(500).json({ message: 'Server error while updating menu item' });
  }
});

// Delete menu item (admin only)
router.delete('/:id', auth, authorize(['admin']), async (req, res) => {
  try {
    const item = await MenuItem.findByIdAndDelete(req.params.id);

    if (!item) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    res.json({ message: 'Menu item deleted successfully' });
  } catch (error) {
    console.error('Delete menu item error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid menu item ID' });
    }
    res.status(500).json({ message: 'Server error while deleting menu item' });
  }
});

// Add review to menu item (authenticated users only)
router.post('/:id/reviews', auth, [
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('comment').optional().trim().isLength({ max: 500 }).withMessage('Comment must be less than 500 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { rating, comment } = req.body;
    const item = await MenuItem.findById(req.params.id);

    if (!item) {
      return res.status(404).json({ message: 'Menu item not found' });
    }

    // Check if user has already reviewed this item
    const existingReview = item.reviews.find(
      review => review.user.toString() === req.user.userId
    );

    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this item' });
    }

    // Add review
    item.reviews.push({
      user: req.user.userId,
      rating,
      comment
    });

    await item.save();

    // Populate the new review with user info
    await item.populate('reviews.user', 'name');

    res.status(201).json({
      message: 'Review added successfully',
      review: item.reviews[item.reviews.length - 1]
    });
  } catch (error) {
    console.error('Add review error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid menu item ID' });
    }
    res.status(500).json({ message: 'Server error while adding review' });
  }
});

// Get menu categories
router.get('/categories/list', async (req, res) => {
  try {
    const categories = await MenuItem.distinct('category');
    res.json(categories);
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ message: 'Server error while fetching categories' });
  }
});

// Get featured items
router.get('/featured/list', async (req, res) => {
  try {
    const featuredItems = await MenuItem.find({ featured: true, available: true })
      .sort({ 'rating.average': -1 })
      .limit(6)
      .lean();

    res.json(featuredItems);
  } catch (error) {
    console.error('Get featured items error:', error);
    res.status(500).json({ message: 'Server error while fetching featured items' });
  }
});

export default router;