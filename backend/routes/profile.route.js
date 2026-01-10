const express = require('express');
const router = express.Router();
const { isAuthenticated } = require('../middleware/middlewares');
const upload = require('../middleware/upload');
const { getUserProfile, updateUserProfile, uploadProfilePicture } = require('../controllers/profile.controller');

//Get user profile data:
router.get('/profile', isAuthenticated, getUserProfile);

//Update user profile:
router.put('/profile', isAuthenticated, updateUserProfile);

//Upload/update profile picture:
router.post('/profile/picture', isAuthenticated, upload.single('profilePicture'), uploadProfilePicture);

module.exports = router;                
