const User = require('../models/users.model');
const CustomErrorHandler = require('../utils/CustomErrorHandler');
const asyncHandler = require('../utils/asyncHandler');
const sendEmail = require('../utils/sendEmail');
const crypto = require('crypto');

// User Registration Controller
const registerUser = asyncHandler(
    async (req, res) => {
        const { fullname, email, phoneno, password } = req.body;

        console.log("Registering User: ", req.body);

        const existingUser = await User.findOne({ email });

        if (existingUser) {
            throw new CustomErrorHandler(409, 'User with this email already exists');
        }

        const newUser = new User({
            fullname,
            email,
            phoneno,
            password
        })

        const token = await newUser.generateAuthToken();
        console.log("Registered Generated Token: ", token);

        // Generate email verification token
        const verificationToken = newUser.generateEmailVerificationToken();
        await newUser.save();

        // Send verification email
        //Send verification email logic can be added here
        console.log("frontend url:", process.env.FRONTEND_URL);
        const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${verificationToken}`;
        await sendEmail({
            email: newUser.email,
            subject: 'Email Verification - Aura Vista Furniture',
            message: 'Please verify your email by clicking the link below:',
            data: {
                name: newUser.fullname,
                verificationUrl
            }
        });

        res.status(201).json({ message: 'User registered successfully', token, newUser });
        req.session.user = newUser;
        console.log("New user created: ", newUser);
    }
)

const loginUser = asyncHandler(
    async (req, res) => {
        // Login logic here

        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (!user) {
            throw new CustomErrorHandler(401, 'Invalid email');
        }

        const isMatch = await user.comparePassword(password);

        if (!isMatch) {
            throw new CustomErrorHandler(401, 'Invalid password');
        }

        const token = await user.generateAuthToken();

        console.log("User logged in: ", user);
        console.log("Loggedin Generated Token: ", token);

        // Update last login
        user.lastLogin = Date.now();
        await user.save();

        console.log('session:', req.session);
        req.session.user = user;
        req.user = user;

        res.status(200).json({
            message: 'Login successful',
            status: 200,
            token,
            user
        });
    }

)

const verifyEmail = asyncHandler(
    async (req, res) => {
        const { token } = req.params;

        const user = await User.findOne({
            emailVerificationToken: crypto.createHash('sha256').update(token).digest('hex'),
            emailVerificationExpire: { $gt: Date.now() }
        });

        if (!user) {
            // res.status(400).json({
            //     success: false,
            //     message: 'Invalid or expired verification token'
            // });
            throw new CustomErrorHandler(400, 'Invalid or expired token');
        }

        // Mark email as verified
        user.isVerified = true;
        user.emailVerificationToken = undefined;
        user.emailVerificationExpire = undefined;
        await user.save();

        res.status(200).json({ success: true, message: 'Email verified successfully' });
    }
)

const resendVerification = asyncHandler(
    async (req, res) => {
        const email = req.body.email;


        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Please provide your email'
            });
        }

        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found with this email'
            });
        }

        if (user.isVerified) {
            return res.status(400).json({
                success: false,
                message: 'Email is already verified'
            });
        }


        // Generate new verification token
        const verificationToken = user.generateEmailVerificationToken();
        await user.save({ validateBeforeSave: false });

        // Create verification URL
        const verificationUrl = `${process.env.FRONTEND_URL}/verify-email/${verificationToken}`;

        // Send verification email
        await sendEmail({
            email: user.email,
            subject: 'Email Verification - Aura Vista Furniture',
            message: 'Please verify your email by clicking the link below:',
            data: {
                name: user.fullname,
                verificationUrl
            }
        })

        res.status(200).json({
            success: true,
            message: 'Verification email sent successfully! Please check your inbox.'
        });

    }
)

module.exports = {
    registerUser,
    loginUser,
    verifyEmail,
    resendVerification,
}