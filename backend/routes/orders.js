import express from 'express';
import { body, validationResult, query } from 'express-validator';
import Order from '../models/Order.js';
import MenuItem from '../models/MenuItem.js';
import { auth, authorize } from '../middleware/auth.js';

const router = express.Router();

// Get orders with filtering and pagination
router.get('/', auth, [
  query('page').optional().isInt({ min: 1 }),
  query('limit').optional().isInt({ min: 1, max: 100 }),
  query('status').optional().isIn(['pending', 'confirmed', 'preparing', 'ready', 'out-for-delivery', 'delivered', 'cancelled']),
  query('orderType').optional().isIn(['dine-in', 'takeout', 'delivery']),
  query('startDate').optional().isISO8601(),
  query('endDate').optional().isISO8601()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      page = 1,
      limit = 20,
      status,
      orderType,
      startDate,
      endDate
    } = req.query;

    // Build filter object
    const filter = {};

    // For customers, only show their own orders
    if (req.user.role === 'customer') {
      filter.customer = req.user.userId;
    }

    if (status) filter.status = status;
    if (orderType) filter.orderType = orderType;

    // Date range filter
    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    // Execute query with pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    const [orders, total] = await Promise.all([
      Order.find(filter)
        .populate('customer', 'name email phone')
        .populate('items.menuItem', 'name image')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit))
        .lean(),
      Order.countDocuments(filter)
    ]);

    res.json({
      orders,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / parseInt(limit)),
        totalItems: total,
        itemsPerPage: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({ message: 'Server error while fetching orders' });
  }
});

// Get single order by ID
router.get('/:id', auth, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('customer', 'name email phone')
      .populate('items.menuItem', 'name image category')
      .populate('statusHistory.updatedBy', 'name')
      .lean();

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if user has permission to view this order
    if (req.user.role === 'customer' && order.customer._id.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(order);
  } catch (error) {
    console.error('Get order error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid order ID' });
    }
    res.status(500).json({ message: 'Server error while fetching order' });
  }
});

// Create new order
router.post('/', auth, [
  body('items').isArray({ min: 1 }).withMessage('Order must contain at least one item'),
  body('items.*.menuItem').isMongoId().withMessage('Invalid menu item ID'),
  body('items.*.quantity').isInt({ min: 1 }).withMessage('Quantity must be at least 1'),
  body('items.*.specialInstructions').optional().trim().isLength({ max: 200 }),
  body('orderType').isIn(['dine-in', 'takeout', 'delivery']).withMessage('Invalid order type'),
  body('deliveryInfo').optional().isObject(),
  body('deliveryInfo.address').if(body('orderType').equals('delivery')).notEmpty().withMessage('Delivery address is required for delivery orders'),
  body('deliveryInfo.phone').optional().matches(/^\+?[\d\s-()]+$/),
  body('tableNumber').if(body('orderType').equals('dine-in')).isInt({ min: 1 }).withMessage('Table number is required for dine-in orders'),
  body('specialRequests').optional().trim().isLength({ max: 500 }),
  body('payment.method').isIn(['cash', 'card', 'online', 'mobile']).withMessage('Invalid payment method')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { items, orderType, deliveryInfo, tableNumber, specialRequests, payment } = req.body;

    // Validate menu items and calculate totals
    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
      const menuItem = await MenuItem.findById(item.menuItem);
      if (!menuItem) {
        return res.status(400).json({ message: `Menu item ${item.menuItem} not found` });
      }
      if (!menuItem.available) {
        return res.status(400).json({ message: `${menuItem.name} is currently unavailable` });
      }

      const itemTotal = menuItem.price * item.quantity;
      subtotal += itemTotal;

      orderItems.push({
        menuItem: menuItem._id,
        name: menuItem.name,
        price: menuItem.price,
        quantity: item.quantity,
        specialInstructions: item.specialInstructions
      });
    }

    // Calculate tax and delivery fee
    const taxRate = 0.08; // 8% tax
    const tax = subtotal * taxRate;
    let deliveryFee = 0;

    if (orderType === 'delivery') {
      deliveryFee = subtotal >= 50 ? 0 : 3.99; // Free delivery over $50
    }

    const total = subtotal + tax + deliveryFee;

    // Create order
    const order = new Order({
      customer: req.user.userId,
      items: orderItems,
      orderType,
      subtotal,
      tax,
      deliveryFee,
      total,
      payment: {
        method: payment.method,
        status: payment.method === 'cash' ? 'pending' : 'processing'
      },
      deliveryInfo: orderType === 'delivery' ? deliveryInfo : undefined,
      tableNumber: orderType === 'dine-in' ? tableNumber : undefined,
      specialRequests,
      estimatedReadyTime: new Date(Date.now() + 30 * 60 * 1000) // 30 minutes from now
    });

    await order.save();

    // Populate the order for response
    await order.populate('customer', 'name email phone');
    await order.populate('items.menuItem', 'name image');

    res.status(201).json({
      message: 'Order created successfully',
      order
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({ message: 'Server error while creating order' });
  }
});

// Update order status (staff/admin only)
router.patch('/:id/status', auth, authorize(['staff', 'admin']), [
  body('status').isIn(['pending', 'confirmed', 'preparing', 'ready', 'out-for-delivery', 'delivered', 'cancelled']).withMessage('Invalid status'),
  body('notes').optional().trim().isLength({ max: 500 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { status, notes } = req.body;

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Update status
    order.status = status;

    // Add to status history
    order.statusHistory.push({
      status,
      updatedBy: req.user.userId,
      notes
    });

    // Update timestamps based on status
    if (status === 'ready') {
      order.actualReadyTime = new Date();
    } else if (status === 'delivered') {
      order.deliveryInfo.actualDeliveryTime = new Date();
      order.payment.status = 'completed';
      order.payment.paidAt = new Date();
    }

    await order.save();

    res.json({
      message: 'Order status updated successfully',
      order
    });
  } catch (error) {
    console.error('Update order status error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid order ID' });
    }
    res.status(500).json({ message: 'Server error while updating order status' });
  }
});

// Cancel order
router.patch('/:id/cancel', auth, [
  body('reason').optional().trim().isLength({ max: 500 })
], async (req, res) => {
  try {
    const { reason } = req.body;

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check permissions
    if (req.user.role === 'customer' && order.customer.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Check if order can be cancelled
    if (['delivered', 'cancelled'].includes(order.status)) {
      return res.status(400).json({ message: 'Order cannot be cancelled' });
    }

    // Update order
    order.status = 'cancelled';
    order.statusHistory.push({
      status: 'cancelled',
      updatedBy: req.user.userId,
      notes: reason || 'Order cancelled by user'
    });

    await order.save();

    res.json({
      message: 'Order cancelled successfully',
      order
    });
  } catch (error) {
    console.error('Cancel order error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid order ID' });
    }
    res.status(500).json({ message: 'Server error while cancelling order' });
  }
});

// Add rating to order
router.post('/:id/rating', auth, [
  body('overall').isInt({ min: 1, max: 5 }).withMessage('Overall rating must be between 1 and 5'),
  body('food').optional().isInt({ min: 1, max: 5 }),
  body('service').optional().isInt({ min: 1, max: 5 }),
  body('delivery').optional().isInt({ min: 1, max: 5 }),
  body('comment').optional().trim().isLength({ max: 500 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { overall, food, service, delivery, comment } = req.body;

    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if user owns this order
    if (order.customer.toString() !== req.user.userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Check if order is delivered
    if (order.status !== 'delivered') {
      return res.status(400).json({ message: 'Order must be delivered to rate' });
    }

    // Check if already rated
    if (order.rating.overall) {
      return res.status(400).json({ message: 'Order has already been rated' });
    }

    // Add rating
    order.rating = {
      overall,
      food,
      service,
      delivery,
      comment,
      ratedAt: new Date()
    };

    await order.save();

    res.json({
      message: 'Rating added successfully',
      rating: order.rating
    });
  } catch (error) {
    console.error('Add rating error:', error);
    if (error.name === 'CastError') {
      return res.status(400).json({ message: 'Invalid order ID' });
    }
    res.status(500).json({ message: 'Server error while adding rating' });
  }
});

// Get order statistics (admin only)
router.get('/stats/overview', auth, authorize(['admin']), async (req, res) => {
  try {
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const startOfWeek = new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000);
    const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);

    const [
      todayOrders,
      weekOrders,
      monthOrders,
      totalOrders,
      todayRevenue,
      weekRevenue,
      monthRevenue,
      totalRevenue,
      statusCounts
    ] = await Promise.all([
      Order.countDocuments({ createdAt: { $gte: startOfDay } }),
      Order.countDocuments({ createdAt: { $gte: startOfWeek } }),
      Order.countDocuments({ createdAt: { $gte: startOfMonth } }),
      Order.countDocuments(),
      Order.aggregate([
        { $match: { createdAt: { $gte: startOfDay }, status: { $ne: 'cancelled' } } },
        { $group: { _id: null, total: { $sum: '$total' } } }
      ]),
      Order.aggregate([
        { $match: { createdAt: { $gte: startOfWeek }, status: { $ne: 'cancelled' } } },
        { $group: { _id: null, total: { $sum: '$total' } } }
      ]),
      Order.aggregate([
        { $match: { createdAt: { $gte: startOfMonth }, status: { $ne: 'cancelled' } } },
        { $group: { _id: null, total: { $sum: '$total' } } }
      ]),
      Order.aggregate([
        { $match: { status: { $ne: 'cancelled' } } },
        { $group: { _id: null, total: { $sum: '$total' } } }
      ]),
      Order.aggregate([
        { $group: { _id: '$status', count: { $sum: 1 } } }
      ])
    ]);

    res.json({
      orders: {
        today: todayOrders,
        week: weekOrders,
        month: monthOrders,
        total: totalOrders
      },
      revenue: {
        today: todayRevenue[0]?.total || 0,
        week: weekRevenue[0]?.total || 0,
        month: monthRevenue[0]?.total || 0,
        total: totalRevenue[0]?.total || 0
      },
      statusBreakdown: statusCounts.reduce((acc, item) => {
        acc[item._id] = item.count;
        return acc;
      }, {})
    });
  } catch (error) {
    console.error('Get order stats error:', error);
    res.status(500).json({ message: 'Server error while fetching order statistics' });
  }
});

export default router;