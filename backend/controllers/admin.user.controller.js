const User = require('../models/users.model.js');
const asyncHandler = require('../utils/asyncHandler.js');
const CustomErrorHandler = require('../utils/CustomErrorHandler');

//Get all users:
const getAllUsers = asyncHandler(
    async (req, res) => {
        const { page = 1, limit = 20, search, role } = req.query;

        let query = {};

        if (search) {
            query.$or = [
                { fullname: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ]
        }

        if (role) query.role = role;

        const users = await User.find(query).select('-password -emailVerificationToken -resetPasswordToken').sort({ createdAt: -1 }).skip((page - 1) * limit).limit(limit);

        const total = await User.countDocuments(query);

        res.status(200).json({
            success: true,
            count: users.length,
            total,
            page: Number(page),
            totalPages: Math.ceil(total / limit),
            data: users
        });
    }
)

const getUserById = asyncHandler(
    async (req, res) => {
        const user = await User.findById(req.params.id).select('-password -emailVerificationToken -resetPasswordToken');

        if (!user) {
            throw new CustomErrorHandler(404, 'User not found');
        }

        res.status(200).json({
            success: true,
            data: user
        });
    }
)

const updateUserRole = asyncHandler(
    async (req, res) => {
        const { role } = req.body;

        if (!['user', 'admin'].includes(role)) {
            throw new CustomErrorHandler(400, 'Invalid role');
        }

        const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true }).select('-password');

        if (!user) {
            throw new CustomErrorHandler(404, 'User not found');
        }

        res.status(200).json({
            success: true,
            message: 'User role updated',
            data: user
        });

    }
)

// Toggle User Active Status
const toggleUserStatus = asyncHandler(
    async (req, res) => {
        const user = await User.findById(req.params.id);

        if (!user) {
            throw new CustomErrorHandler(404, 'User not found');
        }

        user.isActive = !user.isActive;
        await user.save();

        res.status(200).json({
            success: true,
            message: `User ${user.isActive ? 'activated' : 'deactivated'}`,
            data: user
        });

    }
)

const getUserStats = asyncHandler(
    async (req, res) => {
        const totalUsers = await User.countDocuments();
        const activeUsers = await User.countDocuments({ isActive: true });
        const verifiedUsers = await User.countDocuments({ isVerified: true });
        const adminUsers = await User.countDocuments({ role: 'admin' });

        res.status(200).json({
            success: true,
            data: {
                totalUsers,
                activeUsers,
                verifiedUsers,
                adminUsers
            }
        });
    }
)

module.exports = {
    getAllUsers,
    getUserById,
    updateUserRole,
    toggleUserStatus,
    getUserStats,
}