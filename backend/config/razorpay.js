// backend/config/razorpay.js

const Razorpay = require('razorpay');

const razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

console.log('✓ Razorpay configured');

module.exports = razorpayInstance;