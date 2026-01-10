const Order = require('../models/orders.model.js');
const Cart = require('../models/cart.model.js');
const Coupon = require('../models/coupon.model.js');
const asyncHandler = require('../utils/asyncHandler.js');
const CustomHandler = require('../utils/CustomErrorHandler.js');
const CustomErrorHandler = require('../utils/CustomErrorHandler.js');
const razorPayInstance = require('../config/razorpay.js');
const crypto = require('crypto');


// CREATE RAZORPAY ORDER (Before actual order)

const createRazorpayOrder = asyncHandler(
    async (req, res) => {
        const { amount } = req.body;

        const userId = req.user._id;
        const cart = await Cart.findOne({ user: userId });

        if (!cart || cart.items.length === 0) {
            throw new CustomErrorHandler(400, 'Cart is empty');
        }

        try {
            const options = {
                amount: Math.round(amount * 100), // Amount in paise (₹1 = 100 paise)
                currency: 'INR',
                receipt: `receipt_${Date.now()}`,
                payment_capture: 1 // Auto capture payment
            };

            const razorpayOrder = await razorPayInstance.orders.create(options);

            res.status(200).json({
                success: true,
                data: {
                    orderId: razorpayOrder.id,
                    amount: razorpayOrder.amount,
                    currency: razorpayOrder.currency,
                    keyId: process.env.RAZORPAY_KEY_ID // Send key to frontend
                }
            });

        } catch (err) {
            console.error('Razorpay order creation error:', err);
            throw new CustomErrorHandler(500, 'Failed to create Razorpay order');
        }
    }
)

// VERIFY RAZORPAY PAYMENT

const verifyRazorpayPaynent = asyncHandler(
    async (req, res) => {
        const { razorpayOrderId, razorpayPaymentId, razorpaySignature } = req.body;

        // Create signature to verify
        const sign = razorpayOrderId + '|' + razorpayPaymentId;
        const expectedSign = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(sign.toString())
            .digest('hex');

        if (razorpaySignature === expectedSign) {
            res.status(200).json({
                success: true,
                message: 'Payment verified successfully'
            });
        } else {
            throw new CustomErrorHandler(400, 'Invalid payment signature');
        }
    }
)

//Create a new order:
const createOrder = asyncHandler(
    async (req, res) => {
        const { shippingAddress, paymentMethod, couponCode,
            // Razorpay payment details (if online payment)
            razorpayOrderId,
            razorpayPaymentId,
            razorpaySignature } = req.body;

        const userId = req.user._id;

        //get users cart:
        const cart = await Cart.findOne({ user: userId }).populate('items.product');

        if (!cart || cart.items.length === 0) {
            throw new CustomHandler(400, 'Cart is empty');
        }

        // Calculate pricing
        const subtotal = cart.totalPrice;
        const tax = subtotal * 0.18; //18% GST
        const shippingCharge = subtotal > 10000 ? 0 : 500;

        let discount = 0;
        let appliedCoupon = null;

        // Apply coupon if provided
        if (couponCode) {
            const coupon = await Coupon.findOne({ code: couponCode.toUpperCase() });

            if (!coupon || !coupon.isActive) {
                throw new CustomHandler(400, 'Invalid or inactive coupon code');
            }

            const now = new Date();
            if (now < coupon.validFrom || now > coupon.validUntil) {
                throw new CustomHandler(400, 'Coupon has expired or not yet valid');
            }

            if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
                throw new CustomHandler(400, 'Coupon usage limit reached');
            }

            if (subtotal < coupon.minPurchase) {
                throw new CustomHandler(400, `Minimum purchase of ₹${coupon.minPurchase} required`);
            }

            // Calculate discount
            if (coupon.discountType === 'percentage') {
                discount = (subtotal * coupon.discountValue) / 100;
                if (coupon.maxDiscount && discount > coupon.maxDiscount) {
                    discount = coupon.maxDiscount;
                }
            } else {
                discount = coupon.discountValue;
            }

            discount = Math.round(discount);
            appliedCoupon = { code: coupon.code, discount };

            // Increment usage count
            coupon.usedCount += 1;
            await coupon.save();
        }

        const total = subtotal + tax + shippingCharge - discount;

        // VERIFY RAZORPAY PAYMENT (if online payment)
        let paymentStatus = 'pending';
        let paidAt = null;

        if (paymentMethod === 'razorpay') {
            if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
                throw new CustomErrorHandler(400, 'Payment details missing');
            }

            //Verify signature:
            const sign = razorpayOrderId + '|' + razorpayPaymentId;
            const expectedSign = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET).update(sign.toString()).digest('hex');

            if (razorpaySignature !== expectedSign) {
                throw new CustomErrorHandler(400, 'Invalid payment signature');
            }

            //payment verified
            paymentStatus = 'completed';
            paidAt = new Date();
        }

        //Create order:
        const order = new Order({
            user: userId,
            items: cart.items.map((item) => ({
                product: item.product._id,
                name: item.product.name,
                image: item.product.images[0]?.url,
                quantity: item.quantity,
                price: item.price
            })),
            shippingAddress,
            paymentInfo: {
                method: paymentMethod,
                razorpayOrderId: razorpayOrderId || undefined,
                razorpayPaymentId: razorpayPaymentId || undefined,
                razorpaySignature: razorpaySignature || undefined,
                status: paymentStatus,
                paidAt: paidAt
            },
            pricing: { subtotal, tax, shippingCharge, discount, total },
            coupon: appliedCoupon,
            orderStatus: paymentStatus === 'completed' ? 'confirmed' : 'pending',
            statusHistory: [{
                status: paymentStatus === 'completed' ? 'confirmed' : 'pending',
                timestamp: new Date(),
                note: paymentStatus === 'completed'
                    ? 'Order confirmed - Payment received'
                    : 'Order placed - Awaiting payment'
            }]
        });

        await order.save();

        //clear the cart:
        cart.items = [];
        cart.totalItems = 0;
        cart.totalPrice = 0;
        await cart.save();

        res.status(201).json({
            success: true,
            message: 'Order placed successfully',
            data: order
        });

    }
)

// Get users Orders:
const getUserOrders = asyncHandler(
    async (req, res) => {

        const orders = await Order.find({ user: req.user._id }).populate('items.product').sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: orders.length,
            data: orders
        });
    }
)

// Get single order by ID
const getOrderById = asyncHandler(
    async (req, res) => {
        const order = await Order.findOne({ orderNumber: req.params.id }).populate('items.product').populate('user', 'fullname  email').sort({ createdAt: -1 });

        if (!order) {
            throw new CustomHandler(404, 'Order not found');
        }

        // Check if order belongs to user (unless admin)
        if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
            throw new CustomErrorHandler(403, 'Not authorized to view this order');
        }

        res.status(200).json({
            success: true,
            data: order
        });

    }
)

// Update order status (Admin only)
const updateOrderStatus = asyncHandler(async (req, res) => {
    const { status, note } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
        throw new CustomErrorHandler(404, 'Order not found');
    }

    order.orderStatus = status;
    order.statusHistory.push({
        status,
        timestamp: new Date(),
        note: note || `Order status updated to ${status}`
    });

    if (status === 'delivered') {
        order.deliveredAt = new Date();
        order.paymentInfo.status = 'completed';
    }

    if (status === 'cancelled') {
        order.cancelledAt = new Date();
    }

    await order.save();

    res.status(200).json({
        success: true,
        message: 'Order status updated',
        data: order
    });
});

// Cancel order (User)
const cancelOrder = asyncHandler(async (req, res) => {
    const { reason } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
        throw new CustomErrorHandler(404, 'Order not found');
    }

    if (order.user.toString() !== req.user._id.toString()) {
        throw new CustomErrorHandler(403, 'Not authorized');
    }

    if (['shipped', 'delivered', 'cancelled'].includes(order.orderStatus)) {
        throw new CustomErrorHandler(400, 'Cannot cancel order at this stage');
    }

    order.orderStatus = 'cancelled';
    order.cancelledAt = new Date();
    order.cancellationReason = reason;
    order.statusHistory.push({
        status: 'cancelled',
        timestamp: new Date(),
        note: reason || 'Cancelled by user'
    });

    await order.save();

    res.status(200).json({
        success: true,
        message: 'Order cancelled successfully',
        data: order
    });
});

// Get all orders (Admin only)
const getAllOrders = asyncHandler(async (req, res) => {
    const { status, page = 1, limit = 10 } = req.query;

    let query = {};
    if (status) query.orderStatus = status;

    const orders = await Order.find(query)
        .populate('user', 'fullname email')
        .populate('items.product')
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(Number(limit));

    const total = await Order.countDocuments(query);

    res.status(200).json({
        success: true,
        count: orders.length,
        total,
        page: Number(page),
        totalPages: Math.ceil(total / limit),
        data: orders
    });
});

module.exports = {
    createOrder,
    getUserOrders,
    getOrderById,
    updateOrderStatus,
    cancelOrder,
    getAllOrders,
    createRazorpayOrder,
    verifyRazorpayPaynent,
};