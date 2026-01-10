const express = require('express');
const { handleRegistrationValidation, handleLoginValidation } = require('../middleware/middlewares');
const { registerUser, loginUser, verifyEmail, resendVerification } = require('../controllers/auth.controller');
const passport = require('passport');
const CustomErrorHandler = require('../utils/CustomErrorHandler');

const router = express.Router();

router.post('/register', handleRegistrationValidation, registerUser);

router.post('/login', handleLoginValidation, loginUser);

router.get('/verify-email/:token', verifyEmail);

router.post('/resend-verification', resendVerification);

//WHY: Tell Google what info we want
// WHAT: We want user's profile and email
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
// after: User is redirected to Google's login page

router.get('/google/callback', (req, res, next) => {
    passport.authenticate('google', { session: true }, async (err, user, info) => {
        if (err) {
            console.error('Google OAuth error:', err);
            return res.redirect(`${process.env.FRONTEND_URL}/login?error=Login failed. Please try again.`);
        }

        if (!user) {
            console.error('No user returned from Google');
            return res.redirect(`${process.env.FRONTEND_URL}/login?error=Authentication failed. Please try again.`);
        }
        console.log('User authenticated:', user);
        req.login(user, async (err) => {
            if (err) {
                console.error('Session login error:', err);
                return res.redirect(`${process.env.FRONTEND_URL}/login?error=Login failed. Please try again.`);
            }

            // Generate JWT token for the authenticated user
            const token = await user.generateAuthToken();
            console.log('Google OAuth Generated Token:', token);

            user.lastLogin = Date.now();
            await user.save();

            // Redirect with token and user data as query parameters
            const userData = encodeURIComponent(JSON.stringify({
                id: user._id,
                fullname: user.fullname,
                email: user.email,
                isVerified: user.isVerified
            }));

            res.redirect(`${process.env.FRONTEND_URL}/auth/google/success?token=${token}&user=${userData}`);
        });
    })(req, res, next);
});

module.exports = router;
