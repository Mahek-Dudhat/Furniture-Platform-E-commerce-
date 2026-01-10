const User = require('../models/users.model.js');
const CustomErrorHandler = require('../utils/CustomErrorHandler');
const asyncHandler = require('../utils/asyncHandler');
const cloudinary = require('../config/cloudinary');
const fs = require('fs');

// Get user profile
const getUserProfile = asyncHandler(
    async (req, res) => {
        const userId = req.user._id;

        const user = await User.findById(userId).select('-password -emailVerificationToken -emailVerificationExpire -resetPasswordToken -resetPasswordExpire');

        if (!user) {
            throw new CustomErrorHandler(404, 'User not found');
        }

        return res.status(200).json({
            success: true,
            user
        });
    }
)

// Update user profile (name, phone, address)
const updateUserProfile = asyncHandler(
    async (req, res) => {
        const userId = req.user._id;

        const user = await User.findById(userId);

        const { fullname, phoneno, address } = req.body;

        if (!user) {
            throw new CustomErrorHandler(404, 'User not found');
        }

        // Update fields if provided
        if (fullname) user.fullname = fullname;
        if (phoneno) user.phoneno = phoneno;
        if (address) user.address = address;

        await user.save();

        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            user: {
                id: user._id,
                fullname: user.fullname,
                email: user.email,
                phoneno: user.phoneno,
                address: user.address,
                profilePicture: user.profilePicture
            }
        });
    }
)

// Upload/Update profile picture
const uploadProfilePicture = asyncHandler(
    async (req, res) => {

        const userId = req.user._id;

      console.log("File received:", req.file);

        if (!req.file) {
            throw new CustomErrorHandler(400, 'Please upload an image');
        }

        const user = await User.findById(userId);

        if (!user) {
            throw new CustomErrorHandler(404, 'User not found');
        }

        // Delete old profile picture from cloudinary if exists
        if (user.profilePicture && user.profilePicture.publicId) {
            await cloudinary.uploader.destroy(user.profilePicture.publicId);
        }

        // Upload new image to cloudinary
        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: 'furniture-website/profile-pictures',
            width: 300,
            height: 300,
            crop: 'fill'
        })

        // Delete temp file
        fs.unlinkSync(req.file.path);

        user.profilePicture = {
            url: result.secure_url,
            publicId: result.public_id
        }

        await user.save();

        res.status(200).json({
            success: true,
            message: 'Profile picture updated successfully',
            profilePicture: user.profilePicture
        })

    }
)


module.exports = {
    getUserProfile,
    updateUserProfile,
    uploadProfilePicture,
}