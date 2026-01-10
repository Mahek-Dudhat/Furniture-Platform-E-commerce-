const express = require('express');
const router = express.Router();
const {
    createOrder, getAllOrders, getUserOrders, getOrderById, updateOrderStatus, cancelOrder, createRazorpayOrder, verifyRazorpayPaynent } = require('../controllers/order.controller.js');
const { isAuthenticated } = require('../middleware/middlewares.js');

//payment routes:

router.post('/create-razorpay-order', isAuthenticated, createRazorpayOrder);
router.post('/verify-payment', isAuthenticated, verifyRazorpayPaynent);

//User Routes:
router.post('/create', isAuthenticated, createOrder);
router.get('/my-orders', isAuthenticated, getUserOrders);
router.get('/:id', isAuthenticated, getOrderById);
router.put('/:id/cancel', isAuthenticated, cancelOrder);

module.exports = router;