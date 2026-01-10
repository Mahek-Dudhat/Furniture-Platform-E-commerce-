const Joi = require('joi');

// Registration Validation
module.exports.validateRegistration = Joi.object({
    fullname: Joi.string()
        .min(3)
        .max(50)
        .trim()
        .required()
        .messages({
            'string.empty': 'Full name is required',
            'string.min': 'Full name must be at least 3 characters',
            'string.max': 'Full name cannot exceed 50 characters'
        }),

    email: Joi.string()
        .email()
        .trim()
        .lowercase()
        .required()
        .messages({
            'string.empty': 'Email is required',
            'string.email': 'Please provide a valid email address'
        }),

    phoneno: Joi.string()
        .pattern(/^[0-9]{10}$/)
        .required()
        .messages({
            'string.empty': 'Phone number is required',
            'string.pattern.base': 'Phone number must be 10 digits'
        }),

    password: Joi.string()
        .min(8)
        .max(128)
        .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]/)
        .required()
        .messages({
            'string.empty': 'Password is required',
            'string.min': 'Password must be at least 8 characters',
            'string.pattern.base': 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
        }),

    confirmpassword: Joi.string()
        .valid(Joi.ref('password'))
        .required()
        .messages({
            'any.only': 'Passwords do not match',
            'string.empty': 'Confirm password is required'
        })
});

// Login Validation
module.exports.validateLogin = Joi.object({
    email: Joi.string()
        .email()
        .trim()
        .lowercase()
        .required()
        .messages({
            'string.empty': 'Email is required',
            'string.email': 'Please provide a valid email address'
        }),

    password: Joi.string()
        .required()
        .messages({
            'string.empty': 'Password is required'
        })
});