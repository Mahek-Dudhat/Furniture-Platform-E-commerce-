const Coupon = require('../models/coupon.model.js');
const Cart = require('../models/cart.model.js');
const asyncHandler = require('../utils/asyncHandler.js');
const CustomErrorHandler = require('../utils/CustomErrorHandler.js');

// Validate and apply coupon
const applyCoupon = asyncHandler(async (req, res) => {
    const { code } = req.body;
    const userId = req.user._id;

    const coupon = await Coupon.findOne({ code: code.toUpperCase() });

    if (!coupon) {
        throw new CustomErrorHandler(404, 'Invalid coupon code');
    }

    if (!coupon.isActive) {
        throw new CustomErrorHandler(400, 'Coupon is not active');
    }

    const now = new Date();
    if (now < coupon.validFrom || now > coupon.validUntil) {
        throw new CustomErrorHandler(400, 'Coupon has expired or not yet valid');
    }

    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
        throw new CustomErrorHandler(400, 'Coupon usage limit reached');
    }

    const cart = await Cart.findOne({ user: userId }).populate('items.product');

    if (!cart || cart.items.length === 0) {
        throw new CustomErrorHandler(400, 'Cart is empty');
    }

    if (cart.totalPrice < coupon.minPurchase) {
        throw new CustomErrorHandler(400, `Minimum purchase of ₹${coupon.minPurchase} required`);
    }

    let discount = 0;
    if (coupon.discountType === 'percentage') {
        discount = (cart.totalPrice * coupon.discountValue) / 100;
        if (coupon.maxDiscount && discount > coupon.maxDiscount) {
            discount = coupon.maxDiscount;
        }
    } else {
        discount = coupon.discountValue;
    }

    res.status(200).json({
        success: true,
        message: 'Coupon applied successfully',
        data: {
            code: coupon.code,
            discount: Math.round(discount),
            discountType: coupon.discountType,
            discountValue: coupon.discountValue
        }
    });
});

// Create coupon (Admin only)
const createCoupon = asyncHandler(async (req, res) => {
    const coupon = await Coupon.create(req.body);

    res.status(201).json({
        success: true,
        message: 'Coupon created successfully',
        data: coupon
    });
});

// Get all coupons (Admin only)
const getAllCoupons = asyncHandler(async (req, res) => {
    const coupons = await Coupon.find().sort({ createdAt: -1 });

    res.status(200).json({
        success: true,
        count: coupons.length,
        data: coupons
    });
});

// Get active coupons (User)
const getActiveCoupons = asyncHandler(async (req, res) => {

    const now = new Date();

    const coupons = await Coupon.find({
        isActive: true,
        validFrom: { $lte: now },
        validUntil: { $gte: now }
    }).select('code discountType discountValue minPurchase maxDiscount validUntil');

    res.status(200).json({
        success: true,
        count: coupons.length,
        data: coupons
    });
});

// Delete coupon (Admin only)
const deleteCoupon = asyncHandler(async (req, res) => {
    const coupon = await Coupon.findByIdAndDelete(req.params.id);

    if (!coupon) {
        throw new CustomErrorHandler(404, 'Coupon not found');
    }

    res.status(200).json({
        success: true,
        message: 'Coupon deleted successfully'
    });

});

module.exports = {
    applyCoupon,
    createCoupon,
    getAllCoupons,
    getActiveCoupons,
    deleteCoupon
};
