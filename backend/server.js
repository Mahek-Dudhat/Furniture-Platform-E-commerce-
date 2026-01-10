if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const app = express();
const authRoutes = require('./routes/auth.route');
const productRoutes = require('./routes/products.route.js');
const cartRoutes = require('./routes/cart.route.js');
const orderRoutes = require('./routes/order.route.js');
const couponRoutes = require('./routes/coupon.route.js');
const profileRoutes = require('./routes/profile.route.js');
const adminRoutes = require('./routes/admin.route.js');
const CustomErrorHandler = require('./utils/CustomErrorHandler');
const cookieParser = require('cookie-parser');
const passport = require('passport');
const session = require('express-session');
const MongoStore = require('connect-mongo').default || require('connect-mongo');
require('./config/passport');

//Builtin Middleware Used when users submits their on the frontend and backend wants that data:
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//cookie parser middleware
app.use(cookieParser());

app.use(cors(
    {
        origin: process.env.FRONTEND_URL,
        credentials: true
    }
));

console.log("url:", process.env.MONGODB_URL);

//Connect with mongodb database:
mongoose.connect(process.env.MONGODB_URL).then(() => {
    console.log('Connected to MongoDB');


}).catch((err) => {
    console.log('Error connecting to MongoDB', err);
})

const store = MongoStore.create({
    mongoUrl: process.env.MONGODB_URL,
    touchAfter: 24 * 3600
})

store.on("error", (err) => {
    console.log("session store error", err);
})

// SESSION & PASSPORT SETUP (for Google OAuth)
app.use(session({
    store,
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        maxAge: 24 * 60 * 60 * 1000
    }
}));

// Initialize passport
app.use(passport.initialize());
app.use(passport.session());

//Routes Middleware:
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/user', profileRoutes);
app.use('/api/admin', adminRoutes);

app.get('/', (req, res) => {
    res.end('Home page..');
    console.log('Home page..');
})

app.use((req, res, next) => {
    next(new CustomErrorHandler(404, 'Your requested resource not found'));
})

app.use((err, req, res, next) => {
    console.error("err: ", err);
    const { status = 500, message = 'Internal Server Error' } = err;

    res.status(status).json({
        status,
        message
    });
})

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
})