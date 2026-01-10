# Furniture E-Commerce Website

A full-stack e-commerce platform for furniture shopping with user authentication, cart management, order tracking, and admin dashboard.

## Tech Stack

### Frontend
- React 19 with Vite
- React Router DOM for navigation
- Axios for API calls
- Material-UI & Bootstrap for UI components
- Recharts for data visualization
- Lucide React for icons

### Backend
- Node.js with Express
- MongoDB with Mongoose
- Passport.js (Google OAuth)
- JWT authentication
- Razorpay payment integration
- Cloudinary for image uploads
- Nodemailer for emails

## Features

### User Features
- User registration and login (email/password & Google OAuth)
- Browse and filter furniture products
- Shopping cart with persistence
- Coupon code application
- Order placement with Razorpay payment
- Order tracking and history
- User profile management

### Admin Features
- Product management (CRUD operations)
- Order management and status updates
- User management
- Coupon management
- Analytics dashboard with charts

## Project Structure

```
Furniture-Website/
├── backend/
│   ├── config/          # Configuration files (Cloudinary, Passport, Razorpay)
│   ├── controllers/     # Route controllers
│   ├── models/          # MongoDB schemas
│   ├── routes/          # API routes
│   ├── middleware/      # Custom middleware
│   ├── utils/           # Utility functions
│   └── server.js        # Entry point
└── frontend-react/
    ├── public/          # Static assets
    └── src/
        ├── api/         # API service functions
        ├── components/  # React components
        ├── context/     # Context providers
        ├── pages/       # Page components
        └── App.jsx      # Main app component
```

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- MongoDB
- Cloudinary account
- Razorpay account
- Google OAuth credentials (optional)

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file with the following variables:
```env
NODE_ENV=development
PORT=5000
MONGODB_URL=your_mongodb_connection_string
FRONTEND_URL=http://localhost:5173
SESSION_SECRET=your_session_secret
JWT_SECRET=your_jwt_secret

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/google/callback

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Razorpay
RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

# Email
EMAIL_USER=your_email
EMAIL_PASS=your_email_password
```

4. Start the server:
```bash
npm run dev
```

Server runs on `http://localhost:5000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend-react
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```env
VITE_API_URL=http://localhost:5000/api
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
```

4. Start the development server:
```bash
npm run dev
```

Frontend runs on `http://localhost:5173`

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/google` - Google OAuth login

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID

### Cart
- `GET /api/cart` - Get user cart
- `POST /api/cart` - Add item to cart
- `PUT /api/cart/:id` - Update cart item
- `DELETE /api/cart/:id` - Remove cart item

### Orders
- `POST /api/orders` - Create order
- `GET /api/orders` - Get user orders
- `GET /api/orders/:id` - Get order by ID

### Admin
- `GET /api/admin/products` - Manage products
- `GET /api/admin/orders` - Manage orders
- `GET /api/admin/users` - Manage users
- `GET /api/admin/coupons` - Manage coupons

## Scripts

### Backend
```bash
npm run dev    # Start development server with nodemon
```

### Frontend
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
npm run lint     # Run ESLint
```


