const express = require('express');
const router = express.Router();
const {
    applyCoupon,
    createCoupon,
    getAllCoupons,
    getActiveCoupons,
    deleteCoupon
} = require('../controllers/coupon.controller.js');
const { isAuthenticated, isAdmin } = require('../middleware/middlewares.js');

// User routes
router.post('/apply', isAuthenticated, applyCoupon);
router.get('/active', isAuthenticated, getActiveCoupons);

// Admin routes
router.post('/create', isAuthenticated, isAdmin, createCoupon);
router.get('/all', isAuthenticated, isAdmin, getAllCoupons);
router.delete('/:id', isAuthenticated, isAdmin, deleteCoupon);

module.exports = router;
