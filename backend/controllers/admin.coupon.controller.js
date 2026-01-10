const Coupon = require('../models/coupon.model.js');
const asyncHandler = require('../utils/asyncHandler.js');
const CustomErrorHandler = require('../utils/CustomErrorHandler');

//Create coupon:-
const createCoupon = asyncHandler(
    async (req, res) => {
        const { code, discountType, discountValue, minPurchase, maxDiscount, validFrom, validUntil, usageLimit } = req.body;

        const existingCoupon = await Coupon.findOne({ code: code.toUpperCase() });

        if (existingCoupon) {
            throw new CustomErrorHandler(400, 'Coupon already exists');
        }

        const coupon = await Coupon.create({
            code: code.toUpperCase(),
            discountType,
            discountValue,
            minPurchase: minPurchase || 0,
            maxDiscount,
            validFrom: validFrom || new Date(),
            validUntil,
            usageLimit
        });

        res.status(201).json({
            success: true,
            message: 'Coupon created successfully',
            data: coupon
        });
    }
)

const updateCoupon = asyncHandler(
    async (req, res) => {
        const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });

        if (!coupon) {
            throw new CustomErrorHandler(404, 'Coupon not found');
        }

        res.status(200).json({
            success: true,
            message: 'Coupon updated successfully',
            data: coupon
        });
    }
)

const deleteCoupon = asyncHandler(
    async (req, res) => {
        const coupon = await Coupon.findByIdAndDelete(req.params.id);

        if (!coupon) {
            throw new CustomErrorHandler(404, 'Coupon not found');
        }

        res.status(200).json({
            success: true,
            message: 'Coupon deleted successfully'
        });
    }
)

const getAllCoupons = asyncHandler(
    async (req, res) => {
        const { page = 1, limit = 20, isActive } = req.query;

        let query = {};
        if (isActive !== undefined) query.isActive = isActive === 'true';

        const coupons = await Coupon.find(query).sort({ createdAt: -1 }).skip((page - 1) * limit).limit(Number(limit));

        const total = await Coupon.countDocuments(query);

        res.status(200).json({
            success: true,
            count: coupons.length,
            total,
            data: coupons
        });
    }
)

const toggleCouponStatus = asyncHandler(
    async (req, res) => {
        const coupon = await Coupon.findById(req.params.id);

        if (!coupon) {
            throw new CustomErrorHandler(404, 'Coupon not found');
        }

        coupon.isActive = !coupon.isActive;
        await coupon.save();

        res.status(200).json({
            success: true,
            message: `Coupon ${coupon.isActive ? 'activated' : 'deactivated'}`,
            data: coupon
        });
    }
)

module.exports = {
    createCoupon,
    updateCoupon,
    deleteCoupon,
    getAllCoupons,
    toggleCouponStatus,
}