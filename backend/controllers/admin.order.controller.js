const Order = require('../models/orders.model.js');
const asyncHandler = require('../utils/asyncHandler.js');
const CustomErrorHandler = require('../utils/CustomErrorHandler');

//Get all orders:
const getAllOrders = asyncHandler(
    async (req, res) => {
        let { status, page = 1, limit = 20, search } = req.query;

        // Convert pagination values to numbers safely
        page = Math.max(1, Number(page) || 1);
        limit = Math.min(100, Number(limit) || 20); // limit capped to 100

        const query = {};

        // Escape regex special characters (security + performance)
        const escapeRegex = (text) =>
            text.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');

        if (status) query.orderStatus = status;

        // Search by order number or user email
        if (search) {
            const safeSearch = escapeRegex(search.trim());
            query.orderNumber = { $regex: safeSearch, $options: 'i' };
        }

        //Fetch orders:
        const orders = await Order.find(query).populate('user', 'fullname email').populate('items.product', 'name').sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit);

        //Total count
        const total = await Order.countDocuments(query);

        //Send response to the fronetnd:
        res.status(200).json({
            success: true,
            count: orders.length,
            total,
            page,
            totalPages: Math.ceil(total / limit),
            data: orders
        })
    }
)

const updateOrderStatus = asyncHandler(
    async (req, res) => {
        const { status, note, trackingNumber, courier, trackingUrl } = req.body;

        const order = await Order.findById(req.params.id);

        if (!order) {
            throw new CustomErrorHandler(404, 'Order not found');
        }

        order.orderStatus = status;
        order.statusHistory.push({
            status,
            timestamp: new Date(),
            note
        });

        // Update tracking info if provided
        if (trackingNumber || courier || trackingUrl) {
            order.trackingInfo = {
                trackingNumber: trackingNumber || order.trackingInfo?.trackingNumber,
                courier: courier || order.trackingInfo?.courier,
                trackingUrl: trackingUrl || order.trackingUrl?.trackingUrl
            };
        }

        if (status === 'delivered') {
            order.deliveredAt = new Date();
            order.paymentInfo.status = 'completed';
        }
        if (status === 'cancelled') {
            order.cancelledAt = new Date();
            order.cancellationReason = note;
        }

        await order.save();

        res.status(200).json({
            success: true,
            message: 'Order status updated',
            data: order
        });
    }
)

// Get Dashboard Statistics
const getDashboardStats = asyncHandler(
    async (req, res) => {
        const { startDate, endDate } = req.query;

        let dateFilter = {};

        //Display the orders between this dates:
        if (startDate && endDate) {
            dateFilter = {
                createdAt: {
                    $gte: new Date(startDate),
                    $lte: new Date(endDate)
                }
            }
        }

        //Total revenue:
        const revenueData = await Order.aggregate([
            { $match: { ...dateFilter, 'paymentInfo.status': 'completed' } },
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: '$pricing.total' },
                    totalOrders: { $sum: 1 }
                }
            }
        ])

        //display ordersby status:
        const ordersByStatus = await Order.aggregate([
            { $match: dateFilter },
            {
                $group: {
                    _id: '$orderStatus',
                    count: { $sum: 1 }
                }
            }
        ]);

        //Recent orders:
        const recentOrders = await Order.find(dateFilter).populate('user', 'fullname email').sort({ createdAt: -1 }).limit(10);

        //Payment method distribution:
        const paymentMethods = await Order.aggregate([
            { $match: dateFilter },
            {
                $group: {
                    _id: '$paymentInfo.method',
                    count: { $sum: 1 },
                    revenue: { $sum: '$pricing.total' }
                }
            }
        ]);

        // Top selling products
        const topProducts = await Order.aggregate([
            { $match: { ...dateFilter, 'paymentInfo.status': 'completed' } },
            { $unwind: '$items' },
            {
                $group: {
                    _id: '$items.product',
                    salesCount: { $sum: '$items.quantity' },
                    revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } }
                }
            },
            { $sort: { salesCount: -1 } },
            { $limit: 5 },
            {
                $lookup: {
                    from: 'products',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'productDetails'
                }
            },
            { $unwind: '$productDetails' },
            {
                $project: {
                    _id: '$productDetails._id',
                    name: '$productDetails.name',
                    category: '$productDetails.category',
                    price: '$productDetails.price',
                    images: '$productDetails.images',
                    salesCount: 1,
                    revenue: 1
                }
            }
        ]);

        // Top selling categories
        const topCategories = await Order.aggregate([
            { $match: { ...dateFilter, 'paymentInfo.status': 'completed' } },
            { $unwind: '$items' },
            {
                $lookup: {
                    from: 'products',
                    localField: 'items.product',
                    foreignField: '_id',
                    as: 'product'
                }
            },
            { $unwind: '$product' },
            {
                $group: {
                    _id: '$product.category',
                    count: { $sum: '$items.quantity' },
                    revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } }
                }
            },
            { $sort: { count: -1 } },
            { $limit: 6 }
        ]);

        res.status(200).json({
            success: true,
            data: {
                revenue: revenueData[0] || { totalRevenue: 0, totalOrders: 0 },
                ordersByStatus,
                recentOrders,
                paymentMethods,
                topProducts,
                topCategories
            }
        });
    }
);

const getSalesAnalytics = asyncHandler(
    async (req, res) => {
        const { period = 'month' } = req.query;

        let groupBy;
        switch (period) {
            case 'day':
                groupBy = { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } };
                break;
            case 'week':
                groupBy = { $week: '$createdAt' };
                break;
            case 'month':
                groupBy = { $dateToString: { format: '%Y-%m', date: '$createdAt' } };
                break;
            case 'year':
                groupBy = { $year: '$createdAt' };
                break;
            default:
                groupBy = { $dateToString: { format: '%Y-%m', date: '$createdAt' } };
        }

        const salesData = await Order.aggregate([
            { $match: { 'paymentInfo.status': 'completed' } },
            {
                $group: {
                    _id: groupBy,
                    totalSales: { $sum: '$pricing.total' },
                    orderCount: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        res.status(200).json({
            success: true,
            data: salesData
        });
    }
)

// OR Alternative code for sales analytics:
// Get Sales Analytics (improved)
// const getSalesAnalytics = asyncHandler(async (req, res) => {
//   const { period = 'month', startDate, endDate } = req.query;

//   // Build date filter if provided
//   const dateFilter = {};
//   if (startDate || endDate) {

//     dateFilter.createdAt = {};
//     if (startDate) dateFilter.createdAt.$gte = new Date(startDate);
//     if (endDate) dateFilter.createdAt.$lte = new Date(endDate);
//   }

//   // Choose grouping expression and label formatter
//   let groupExpr;
//   let projectPeriod; // how we want the client-facing string to look
//   const tz = 'Asia/Kolkata'; // use your timezone

//   switch (period) {
//     case 'day':
//       groupExpr = { $dateToString: { format: '%Y-%m-%d', date: '$createdAt', timezone: tz } };
//       projectPeriod = '$_id';
//       break;
//     case 'week':
//       // use ISO week + year to avoid collisions across years
//       groupExpr = {
//         $concat: [
//           { $toString: { $isoWeekYear: '$createdAt' } }, // year
//           '-W',
//           { $toString: { $isoWeek: '$createdAt' } }      // week number
//         ]
//       };
//       projectPeriod = '$_id';
//       break;
//     case 'year':
//       groupExpr = { $dateToString: { format: '%Y', date: '$createdAt', timezone: tz } };
//       projectPeriod = '$_id';
//       break;
//     case 'month':
//     default:
//       groupExpr = { $dateToString: { format: '%Y-%m', date: '$createdAt', timezone: tz } };
//       projectPeriod = '$_id';
//   }

//   const pipeline = [
//     // 1) filter by completed payments and optional date range
//     { $match: { 'paymentInfo.status': 'completed', ...(dateFilter.createdAt ? { createdAt: dateFilter.createdAt } : {}) } },

//     // 2) group by chosen period expression
//     {
//       $group: {
//         _id: groupExpr,
//         totalSales: { $sum: '$pricing.total' },
//         orderCount: { $sum: 1 }
//       }
//     },

//     // 3) sort by period (string sort for YYYY-MM or lexicographic works)
//     { $sort: { _id: 1 } },

//     // 4) project final shape
//     {
//       $project: {
//         _id: 0,
//         period: projectPeriod,
//         totalSales: 1,
//         orderCount: 1
//       }
//     }
//   ];

//   const salesData = await Order.aggregate(pipeline);

//   res.status(200).json({
//     success: true,
//     data: salesData
//   });
// });




module.exports = {
    getAllOrders,
    updateOrderStatus,
    getDashboardStats,
    getSalesAnalytics,
}