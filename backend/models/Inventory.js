import mongoose from 'mongoose';

const inventorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Item name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: ['vegetables', 'spices', 'grains', 'proteins', 'oils', 'beverages', 'dairy', 'condiments', 'equipment'],
    lowercase: true
  },
  currentStock: {
    type: Number,
    required: [true, 'Current stock is required'],
    min: [0, 'Stock cannot be negative']
  },
  minimumStock: {
    type: Number,
    required: [true, 'Minimum stock level is required'],
    min: [0, 'Minimum stock cannot be negative']
  },
  maximumStock: {
    type: Number,
    min: [0, 'Maximum stock cannot be negative']
  },
  unit: {
    type: String,
    required: [true, 'Unit is required'],
    enum: ['kg', 'g', 'lbs', 'oz', 'liters', 'ml', 'pieces', 'bottles', 'cans', 'bags', 'boxes']
  },
  costPerUnit: {
    type: Number,
    required: [true, 'Cost per unit is required'],
    min: [0, 'Cost cannot be negative']
  },
  supplier: {
    name: {
      type: String,
      required: [true, 'Supplier name is required']
    },
    contact: {
      phone: String,
      email: String,
      address: String
    },
    leadTime: Number // days
  },
  location: {
    warehouse: String,
    section: String,
    shelf: String
  },
  expiryDate: Date,
  batchNumber: String,
  lastRestocked: {
    type: Date,
    default: Date.now
  },
  lastOrderDate: Date,
  averageUsagePerDay: {
    type: Number,
    default: 0
  },
  reorderPoint: {
    type: Number,
    default: function() {
      return this.minimumStock;
    }
  },
  isPerishable: {
    type: Boolean,
    default: false
  },
  storageConditions: {
    temperature: {
      min: Number,
      max: Number,
      unit: {
        type: String,
        enum: ['celsius', 'fahrenheit'],
        default: 'celsius'
      }
    },
    humidity: {
      min: Number,
      max: Number
    },
    specialRequirements: [String]
  },
  nutritionalInfo: {
    calories: Number,
    protein: Number,
    carbs: Number,
    fat: Number,
    fiber: Number
  },
  allergens: [String],
  certifications: [String], // organic, halal, kosher, etc.
  stockMovements: [{
    type: {
      type: String,
      enum: ['in', 'out', 'adjustment', 'waste', 'transfer'],
      required: true
    },
    quantity: {
      type: Number,
      required: true
    },
    reason: String,
    reference: String, // order number, transfer ID, etc.
    performedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    timestamp: {
      type: Date,
      default: Date.now
    },
    notes: String
  }],
  alerts: [{
    type: {
      type: String,
      enum: ['low-stock', 'expiring-soon', 'expired', 'overstock'],
      required: true
    },
    message: String,
    isActive: {
      type: Boolean,
      default: true
    },
    createdAt: {
      type: Date,
      default: Date.now
    },
    acknowledgedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    acknowledgedAt: Date
  }]
}, {
  timestamps: true
});

// Indexes for better query performance
inventorySchema.index({ category: 1 });
inventorySchema.index({ currentStock: 1 });
inventorySchema.index({ minimumStock: 1 });
inventorySchema.index({ expiryDate: 1 });
inventorySchema.index({ 'supplier.name': 1 });
inventorySchema.index({ name: 'text' });

// Virtual for stock status
inventorySchema.virtual('stockStatus').get(function() {
  if (this.currentStock <= 0) return 'out-of-stock';
  if (this.currentStock <= this.minimumStock) return 'low-stock';
  if (this.maximumStock && this.currentStock >= this.maximumStock) return 'overstock';
  return 'in-stock';
});

// Virtual for days until expiry
inventorySchema.virtual('daysUntilExpiry').get(function() {
  if (!this.expiryDate) return null;
  const today = new Date();
  const expiry = new Date(this.expiryDate);
  const diffTime = expiry - today;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

// Method to add stock movement
inventorySchema.methods.addStockMovement = function(type, quantity, reason, reference, performedBy, notes) {
  this.stockMovements.push({
    type,
    quantity,
    reason,
    reference,
    performedBy,
    notes
  });

  // Update current stock based on movement type
  if (type === 'in') {
    this.currentStock += quantity;
  } else if (type === 'out' || type === 'waste') {
    this.currentStock = Math.max(0, this.currentStock - quantity);
  } else if (type === 'adjustment') {
    this.currentStock = quantity; // Set to exact quantity for adjustments
  }

  // Update last restocked date for 'in' movements
  if (type === 'in') {
    this.lastRestocked = new Date();
  }
};

// Method to check and create alerts
inventorySchema.methods.checkAlerts = function() {
  const alerts = [];

  // Low stock alert
  if (this.currentStock <= this.minimumStock) {
    alerts.push({
      type: 'low-stock',
      message: `${this.name} is running low (${this.currentStock} ${this.unit} remaining)`
    });
  }

  // Expiring soon alert (within 7 days)
  if (this.expiryDate) {
    const daysUntilExpiry = this.daysUntilExpiry;
    if (daysUntilExpiry <= 7 && daysUntilExpiry > 0) {
      alerts.push({
        type: 'expiring-soon',
        message: `${this.name} expires in ${daysUntilExpiry} days`
      });
    } else if (daysUntilExpiry <= 0) {
      alerts.push({
        type: 'expired',
        message: `${this.name} has expired`
      });
    }
  }

  // Overstock alert
  if (this.maximumStock && this.currentStock >= this.maximumStock) {
    alerts.push({
      type: 'overstock',
      message: `${this.name} is overstocked (${this.currentStock} ${this.unit})`
    });
  }

  // Add new alerts (avoid duplicates)
  alerts.forEach(alert => {
    const existingAlert = this.alerts.find(a => 
      a.type === alert.type && a.isActive
    );
    if (!existingAlert) {
      this.alerts.push(alert);
    }
  });
};

// Pre-save middleware to check alerts
inventorySchema.pre('save', function(next) {
  if (this.isModified('currentStock') || this.isModified('expiryDate')) {
    this.checkAlerts();
  }
  next();
});

export default mongoose.model('Inventory', inventorySchema);