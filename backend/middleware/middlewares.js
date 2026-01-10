const CustomErrorHandler = require('../utils/CustomErrorHandler');
const asyncHandler = require('../utils/asyncHandler');
const jwt = require('jsonwebtoken');
const { validateRegistration, validateLogin } = require('../utils/uservalidation');
const User = require('../models/users.model.js');

//Handle Registration Validation Error:-
const handleRegistrationValidation = asyncHandler((req, res, next) => {

    const { error } = validateRegistration.validate(req.body);
    if (error) {
        throw new CustomErrorHandler(400, "Invalid Registration Data: " + error.details[0].message);
    }
    next();

});

//Handle Login Validation Error:-
const handleLoginValidation = asyncHandler((req, res, next) => {

    const { error } = validateLogin.validate(req.body);
    if (error) {
        throw new CustomErrorHandler(400, "Invalid Login Data: " + error.details[0].message);
    }
    next();

})

//Check if user is authenticated Middleware:-
const isAuthenticated = asyncHandler(
    async (req, res, next) => {
        // Authentication logic here

        console.log('Before Auth Token Extraction', req.user);

        const token = req.headers['authorization']?.split(' ')[1];
        console.log("Auth Token: ", token);

        if (!token) {
            res.redirect('http://localhost:5000/api/v1/auth/login');

            throw new CustomErrorHandler(401, 'Access Denied. No token provided.');
        }

        // Verify token logic (e.g., using JWT)
        // If valid, attach user info to req.user
        // If invalid, throw error
        const decod = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Decoded Token: ", decod);

        const user = await User.findById(decod.userId);
        if (!user) {
            throw new CustomErrorHandler(401, 'Invalid token. User not found.');
        }
        req.user = { _id: decod.userId, ...decod };
        next();
    }
)

//Check is user is authorized Middleware:-
const isAuthorized = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            res.status(401).json({ message: 'User not authenticated' });
            throw new CustomErrorHandler(401, 'User not authenticated');
        }

        if (!roles.includes(req.user.role)) {
            res.status(403).json({ message: 'User not authorized to access this resource' });
            throw new CustomErrorHandler(403, 'User not authorized to access this resource');
        }

        next();
    }
}

// Check if user is admin
const isAdmin = (req, res, next) => {
    if (!req.user) {
        throw new CustomErrorHandler(401, 'User not authenticated');
    }
    if (req.user.role !== 'admin') {
        throw new CustomErrorHandler(403, 'Admin access required');
    }
    next();
};

module.exports = {
    handleRegistrationValidation,
    handleLoginValidation,
    isAuthenticated,
    isAuthorized,
    isAdmin
};
