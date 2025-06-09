import express from 'express';
import { body, validationResult, query } from 'express-validator';
import Inventory from '../models/Inventory.js';
import { auth, authorize } from '../middleware/auth.js';

const router = express.Router();

// Get all inventory items with filtering and pagination
router.get('/', auth, authorize(['staff', 'admin']), [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('category').optional().isIn(['vegetables', 'spices', 'grains', 'proteins', 'oils', 'beverages', 'dairy', 'condiments', 'equipment']),
  query('lowStock').optional().isBoolean(),
  query('expiringSoon').optional().isBoolean(),
  query('search').optional().isLength({ min: 1, max: 100 })
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
      lowStock,
      expiringSoon,
      search
    } = req.query;

    // Build filter object
    const filter = {};

    if (category) filter.category = category;
    if (search) filter.$text = { $search: search };

    // Low stock filter
    if (lowStock === 'true') {
      filter.$expr = { $lte: ['$currentStock', '$minimumStock'] };
    }

    // Expiring soon filter (within 7 days)
    if (expiringSoon === 'true') {
      const sevenDaysFromNow = new Date();
      sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);
      filter.expiryDate = { $lte: sevenDaysFromNow, $gte: new Date() };
    }

    // Execute query with pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const [items, total] = await Promise.all([
      Inventory.find(filter)
        .sort({ name: 1 })
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      Inventory.countDocuments(filter)
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
    console.error('Get inventory items error:', error);
    res.status(500).json({ message: 'Server error while fetching inventory items' });
  }
});

// Get single inventory item by ID
router.get('/:id', auth, authorize(['staff', 'admin']), async (req, res) => {
  try {
    const item = await Inventory.findById(req.params.id)
      .populate('stockMovements.performedBy', 'name')
      .populate('alerts.acknowledgedBy', 'name')
      .lean();

    if (!item) {
      return res.status(404).json({ message: 'Inventory item not found' });
    }

    res.json(item);
  } catch (error) {
    console.error('Get inventory item error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid inventory item ID' });
    }
    res.status(500).json({ message: 'Server error while fetching inventory item' });
  }
});

// Create new inventory item (admin only)
router.post('/', auth, authorize(['admin']), [
  body('name').trim().isLength({ min: 1, max: 100 }).withMessage('Name is required and must be less than 100 characters'),
  body('category').isIn(['vegetables', 'spices', 'grains', 'proteins', 'oils', 'beverages', 'dairy', 'condiments', 'equipment']).withMessage('Invalid category'),
  body('currentStock').isFloat({ min: 0 }).withMessage('Current stock must be a non-negative number'),
  body('minimumStock').isFloat({ min: 0 }).withMessage('Minimum stock must be a non-negative number'),
  body('maximumStock').optional().isFloat({ min: 0 }).withMessage('Maximum stock must be a non-negative number'),
  body('unit').isIn(['kg', 'g', 'lbs', 'oz', 'liters', 'ml', 'pieces', 'bottles', 'cans', 'bags', 'boxes']).withMessage('Invalid unit'),
  body('costPerUnit').isFloat({ min: 0 }).withMessage('Cost per unit must be a non-negative number'),
  body('supplier.name').trim().isLength({ min: 1 }).withMessage('Supplier name is required'),
  body('supplier.contact.phone').optional().matches(/^\+?[\d\s-()]+$/),
  body('supplier.contact.email').optional().isEmail(),
  body('supplier.leadTime').optional().isInt({ min: 0 }),
  body('expiryDate').optional().isISO8601(),
  body('batchNumber').optional().trim(),
  body('isPerishable').optional().isBoolean()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const inventoryItem = new Inventory(req.body);
    
    // Add initial stock movement
    inventoryItem.addStockMovement(
      'in',
      inventoryItem.currentStock,
      'Initial stock',
      'INITIAL',
      req.user.userId,
      'Initial inventory setup'
    );

    await inventoryItem.save();

    res.status(201).json({
      message: 'Inventory item created successfully',
      item: inventoryItem
    });
  } catch (error) {
    console.error('Create inventory item error:', error);
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Inventory item with this name already exists' });
    }
    res.status(500).json({ message: 'Server error while creating inventory item' });
  }
});

// Update inventory item (admin only)
router.put('/:id', auth, authorize(['admin']), [
  body('name').optional().trim().isLength({ min: 1, max: 100 }),
  body('category').optional().isIn(['vegetables', 'spices', 'grains', 'proteins', 'oils', 'beverages', 'dairy', 'condiments', 'equipment']),
  body('minimumStock').optional().isFloat({ min: 0 }),
  body('maximumStock').optional().isFloat({ min: 0 }),
  body('unit').optional().isIn(['kg', 'g', 'lbs', 'oz', 'liters', 'ml', 'pieces', 'bottles', 'cans', 'bags', 'boxes']),
  body('costPerUnit').optional().isFloat({ min: 0 }),
  body('supplier.name').optional().trim().isLength({ min: 1 }),
  body('supplier.contact.phone').optional().matches(/^\+?[\d\s-()]+$/),
  body('supplier.contact.email').optional().isEmail(),
  body('supplier.leadTime').optional().isInt({ min: 0 }),
  body('expiryDate').optional().isISO8601(),
  body('batchNumber').optional().trim(),
  body('isPerishable').optional().isBoolean()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const item = await Inventory.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!item) {
      return res.status(404).json({ message: 'Inventory item not found' });
    }

    res.json({
      message: 'Inventory item updated successfully',
      item
    });
  } catch (error) {
    console.error('Update inventory item error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid inventory item ID' });
    }
    res.status(500).json({ message: 'Server error while updating inventory item' });
  }
});

// Update stock (staff/admin)
router.patch('/:id/stock', auth, authorize(['staff', 'admin']), [
  body('type').isIn(['in', 'out', 'adjustment', 'waste', 'transfer']).withMessage('Invalid movement type'),
  body('quantity').isFloat({ min: 0 }).withMessage('Quantity must be a non-negative number'),
  body('reason').trim().isLength({ min: 1, max: 200 }).withMessage('Reason is required'),
  body('reference').optional().trim(),
  body('notes').optional().trim().isLength({ max: 500 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { type, quantity, reason, reference, notes } = req.body;

    const item = await Inventory.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Inventory item not found' });
    }

    // Validate stock movement
    if (type === 'out' || type === 'waste') {
      if (quantity > item.currentStock) {
        return res.status(400).json({ message: 'Insufficient stock for this operation' });
      }
    }

    // Add stock movement
    item.addStockMovement(type, quantity, reason, reference, req.user.userId, notes);

    await item.save();

    res.json({
      message: 'Stock updated successfully',
      item
    });
  } catch (error) {
    console.error('Update stock error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid inventory item ID' });
    }
    res.status(500).json({ message: 'Server error while updating stock' });
  }
});

// Acknowledge alert (staff/admin)
router.patch('/:id/alerts/:alertId/acknowledge', auth, authorize(['staff', 'admin']), async (req, res) => {
  try {
    const item = await Inventory.findById(req.params.id);
    if (!item) {
      return res.status(404).json({ message: 'Inventory item not found' });
    }

    const alert = item.alerts.id(req.params.alertId);
    if (!alert) {
      return res.status(404).json({ message: 'Alert not found' });
    }

    alert.isActive = false;
    alert.acknowledgedBy = req.user.userId;
    alert.acknowledgedAt = new Date();

    await item.save();

    res.json({
      message: 'Alert acknowledged successfully',
      alert
    });
  } catch (error) {
    console.error('Acknowledge alert error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid ID' });
    }
    res.status(500).json({ message: 'Server error while acknowledging alert' });
  }
});

// Delete inventory item (admin only)
router.delete('/:id', auth, authorize(['admin']), async (req, res) => {
  try {
    const item = await Inventory.findByIdAndDelete(req.params.id);

    if (!item) {
      return res.status(404).json({ message: 'Inventory item not found' });
    }

    res.json({ message: 'Inventory item deleted successfully' });
  } catch (error) {
    console.error('Delete inventory item error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid inventory item ID' });
    }
    res.status(500).json({ message: 'Server error while deleting inventory item' });
  }
});

// Get inventory alerts (staff/admin)
router.get('/alerts/active', auth, authorize(['staff', 'admin']), async (req, res) => {
  try {
    const items = await Inventory.find({
      'alerts.isActive': true
    }).select('name alerts').lean();

    const activeAlerts = [];
    items.forEach(item => {
      item.alerts.forEach(alert => {
        if (alert.isActive) {
          activeAlerts.push({
            ...alert,
            itemId: item._id,
            itemName: item.name
          });
        }
      });
    });

    // Sort by creation date (newest first)
    activeAlerts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.json(activeAlerts);
  } catch (error) {
    console.error('Get alerts error:', error);
    res.status(500).json({ message: 'Server error while fetching alerts' });
  }
});

// Get inventory statistics (admin only)
router.get('/stats/overview', auth, authorize(['admin']), async (req, res) => {
  try {
    const [
      totalItems,
      lowStockItems,
      expiringItems,
      totalValue,
      categoryBreakdown,
      recentMovements
    ] = await Promise.all([
      Inventory.countDocuments(),
      Inventory.countDocuments({ $expr: { $lte: ['$currentStock', '$minimumStock'] } }),
      Inventory.countDocuments({
        expiryDate: {
          $lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
          $gte: new Date()
        }
      }),
      Inventory.aggregate([
        { $group: { _id: null, total: { $sum: { $multiply: ['$currentStock', '$costPerUnit'] } } } }
      ]),
      Inventory.aggregate([
        { $group: { _id: '$category', count: { $sum: 1 }, value: { $sum: { $multiply: ['$currentStock', '$costPerUnit'] } } } }
      ]),
      Inventory.aggregate([
        { $unwind: '$stockMovements' },
        { $sort: { 'stockMovements.timestamp': -1 } },
        { $limit: 10 },
        { $project: { name: 1, stockMovement: '$stockMovements' } }
      ])
    ]);

    res.json({
      summary: {
        totalItems,
        lowStockItems,
        expiringItems,
        totalValue: totalValue[0]?.total || 0
      },
      categoryBreakdown: categoryBreakdown.reduce((acc, item) => {
        acc[item._id] = {
          count: item.count,
          value: item.value
        };
        return acc;
      }, {}),
      recentMovements
    });
  } catch (error) {
    console.error('Get inventory stats error:', error);
    res.status(500).json({ message: 'Server error while fetching inventory statistics' });
  }
});

export default router;