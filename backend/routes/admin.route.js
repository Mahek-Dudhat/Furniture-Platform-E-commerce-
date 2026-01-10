const express = require('express');
const router = express.Router();
const { isAuthenticated, isAdmin } = require('../middleware/middlewares.js');
const upload = require('../middleware/upload.js');
const {
    getAllProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    bulkUpdateStock
} = require('../controllers/admin.product.controller.js');

const {
    getAllOrders,
    updateOrderStatus,
    getDashboardStats,
    getSalesAnalytics
} = require('../controllers/admin.order.controller.js');

const {
    getAllUsers,
    getUserById,
    updateUserRole,
    toggleUserStatus,
    getUserStats
} = require('../controllers/admin.user.controller.js');

const {
    createCoupon,
    updateCoupon,
    deleteCoupon,
    getAllCoupons,
    toggleCouponStatus
} = require('../controllers/admin.coupon.controller.js');

// Apply authentication and admin middleware to all routes
router.use(isAuthenticated, isAdmin);

//Prodcut routes:
router.get('/products', getAllProducts);
router.post('/products', upload.array('images', 5), createProduct);
router.put('/products/:id', upload.array('images', 5), updateProduct);
router.delete('/products/:id', deleteProduct);
router.patch('/products/bulk-stock', bulkUpdateStock);

//Order routes:
router.get('/orders', getAllOrders);
router.put('/orders/:id/status', updateOrderStatus);
router.get('/dashboard/stats', getDashboardStats);
router.get('/dashboard/sales', getSalesAnalytics);

//User routes:
router.get('/users', getAllUsers);
router.get('/users/stats/overview', getUserStats);
router.get('/users/:id', getUserById);
router.put('/users/:id/role', updateUserRole);
router.patch('/users/:id/toggle-status', toggleUserStatus);

//Coupon routes:
router.post('/coupons', createCoupon);
router.put('/coupons/:id', updateCoupon);
router.delete('/coupons/:id', deleteCoupon);
router.get('/coupons', getAllCoupons);
router.patch('/coupons/:id/toggle-status', toggleCouponStatus);

module.exports = router;

