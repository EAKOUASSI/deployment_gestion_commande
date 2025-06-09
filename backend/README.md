# African Restaurant Backend API

A comprehensive Node.js/Express backend API for managing an African restaurant's operations, including menu management, order processing, inventory tracking, and user management.

## Features

### Core Functionality
- **User Management**: Registration, authentication, role-based access control
- **Menu Management**: CRUD operations for menu items with categories, ratings, and reviews
- **Order Processing**: Complete order lifecycle from creation to delivery
- **Inventory Management**: Stock tracking, alerts, and supplier management
- **Authentication**: JWT-based authentication with role-based permissions

### Security Features
- Password hashing with bcrypt
- JWT token authentication
- Rate limiting
- Input validation and sanitization
- CORS protection
- Helmet security headers

### Database Models
- **User**: Customer, staff, and admin user management
- **MenuItem**: Menu items with categories, pricing, and reviews
- **Order**: Order processing with status tracking and payment handling
- **Inventory**: Stock management with movement tracking and alerts

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: express-validator
- **Security**: bcryptjs, helmet, cors, express-rate-limit

## Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file based on `.env.example`:
   ```bash
   cp .env.example .env
   ```

4. Configure your environment variables:
   - `MONGODB_URI`: Your MongoDB connection string
   - `JWT_SECRET`: A secure secret for JWT tokens
   - `PORT`: Server port (default: 5000)

5. Start the development server:
   ```bash
   npm run dev
   ```

## API Endpoints

### Authentication (`/api/auth`)
- `POST /register` - Register new user
- `POST /login` - User login
- `GET /me` - Get current user profile
- `PUT /profile` - Update user profile
- `PUT /change-password` - Change password
- `POST /logout` - Logout user

### Menu Management (`/api/menu`)
- `GET /` - Get all menu items (with filtering and pagination)
- `GET /:id` - Get single menu item
- `POST /` - Create menu item (admin only)
- `PUT /:id` - Update menu item (admin only)
- `DELETE /:id` - Delete menu item (admin only)
- `POST /:id/reviews` - Add review to menu item
- `GET /categories/list` - Get menu categories
- `GET /featured/list` - Get featured items

### Order Management (`/api/orders`)
- `GET /` - Get orders (with filtering)
- `GET /:id` - Get single order
- `POST /` - Create new order
- `PATCH /:id/status` - Update order status (staff/admin)
- `PATCH /:id/cancel` - Cancel order
- `POST /:id/rating` - Add rating to order
- `GET /stats/overview` - Get order statistics (admin)

### Inventory Management (`/api/inventory`)
- `GET /` - Get inventory items (staff/admin)
- `GET /:id` - Get single inventory item
- `POST /` - Create inventory item (admin)
- `PUT /:id` - Update inventory item (admin)
- `PATCH /:id/stock` - Update stock levels
- `PATCH /:id/alerts/:alertId/acknowledge` - Acknowledge alerts
- `DELETE /:id` - Delete inventory item (admin)
- `GET /alerts/active` - Get active alerts
- `GET /stats/overview` - Get inventory statistics (admin)

### User Management (`/api/users`)
- `GET /` - Get all users (admin only)
- `GET /:id` - Get single user
- `POST /` - Create new user (admin only)
- `PUT /:id` - Update user
- `PATCH /:id/deactivate` - Deactivate user (admin)
- `PATCH /:id/activate` - Activate user (admin)
- `DELETE /:id` - Delete user (admin)
- `GET /stats/overview` - Get user statistics (admin)

## User Roles

### Customer
- Browse menu and place orders
- Track order status
- Rate and review orders
- Manage personal profile

### Staff
- View and update order status
- Manage inventory stock levels
- View inventory alerts
- Process customer orders

### Admin
- Full access to all features
- Manage menu items
- Manage users and roles
- View analytics and reports
- Manage inventory items

## Data Models

### User Schema
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: ['customer', 'staff', 'admin'],
  phone: String,
  address: Object,
  preferences: Object,
  isActive: Boolean,
  timestamps: true
}
```

### MenuItem Schema
```javascript
{
  name: String,
  description: String,
  price: Number,
  category: ['appetizers', 'mains', 'desserts', 'beverages'],
  image: String,
  spiceLevel: ['mild', 'medium', 'hot'],
  dietary: Array,
  available: Boolean,
  rating: Object,
  reviews: Array,
  timestamps: true
}
```

### Order Schema
```javascript
{
  orderNumber: String (unique),
  customer: ObjectId (ref: User),
  items: Array,
  status: ['pending', 'confirmed', 'preparing', 'ready', 'out-for-delivery', 'delivered', 'cancelled'],
  orderType: ['dine-in', 'takeout', 'delivery'],
  subtotal: Number,
  tax: Number,
  deliveryFee: Number,
  total: Number,
  payment: Object,
  deliveryInfo: Object,
  statusHistory: Array,
  timestamps: true
}
```

### Inventory Schema
```javascript
{
  name: String,
  category: String,
  currentStock: Number,
  minimumStock: Number,
  unit: String,
  costPerUnit: Number,
  supplier: Object,
  expiryDate: Date,
  stockMovements: Array,
  alerts: Array,
  timestamps: true
}
```

## Error Handling

The API uses consistent error response format:
```javascript
{
  message: "Error description",
  errors: [...] // Validation errors if applicable
}
```

Common HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `500` - Internal Server Error

## Development

### Running Tests
```bash
npm test
```

### Code Structure
```
backend/
├── models/          # Mongoose schemas
├── routes/          # Express route handlers
├── middleware/      # Custom middleware
├── server.js        # Main server file
├── package.json     # Dependencies and scripts
└── README.md        # This file
```

### Environment Variables
See `.env.example` for all required environment variables.

## Deployment

The backend is designed to be deployed on platforms like:
- Heroku
- Vercel (serverless functions)
- DigitalOcean App Platform
- AWS EC2/ECS

Make sure to:
1. Set all environment variables
2. Configure MongoDB connection
3. Set up proper CORS origins
4. Configure rate limiting for production

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.# Backend_Feblihi
