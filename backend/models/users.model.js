const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
    fullname: {
        type: String,
        required: [true, 'Please enter your name..'],
        trim: true,
    },
    email: {
        type: String,
        required: [true, 'Please enter your email..'],
        unique: true,
        lowercase: true,
        match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email'],
    },
    password: {
        type: String,
        // Password not required for Google OAuth users
        required: function () {
            return !this.googleId; // Only required if not using Google OAuth
        },
        minlength: [6, 'Password must be at least 6 characters..']
    },
    googleId: {
        type: String,
        unique: true,
        sparse: true // Allows null values
    },

    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
    },
    phoneno: {
        type: String,
        match: [/^[0-9]{10}$/, 'Please enter a valid 10-digit phone number'],
    },
    address: {
        street: String,
        city: String,
        state: String,
        zipCode: String,
        country: String
    },
    profilePicture: {
        url: {
            type: String,
            default: null
        },
        publicId: {
            type: String,
            default: null
        }
    },
    isActive: {
        type: Boolean,
        default: true,
    },
    wishlist: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product'
        }
    ],
    emailVerificationToken: String,
    emailVerificationExpire: Date,
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    isVerified: {
        type: Boolean,
        default: false,
    },
    lastLogin: Date
},
    {
        timestamps: true
    })

userSchema.index({ email: 1 });

userSchema.pre('save', async function () {

    //Only hash if password is modified or new
    if (!this.isModified('password') || !this.password) {
        return;
    }

    // Don't hash if it's a Google OAuth generated password
    if (this.password.startsWith('GOOGLE_AUTH_')) return;


    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        //next();
    } catch (err) {
        throw err;
    }
})

userSchema.methods.generateAuthToken = async function () {

    const payload = {
        userId: this._id,
        role: this.role,
        email: this.email
    }

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRE });
    return token;
}

userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
}

userSchema.methods.generateEmailVerificationToken = function () {

    const verificationToken = crypto.randomBytes(32).toString('hex');

    this.emailVerificationToken = crypto.createHash('sha256').update(verificationToken).digest('hex');
    this.emailVerificationExpire = Date.now() + 24 * 60 * 60 * 1000; // 24 hours

    return verificationToken;

}

module.exports = mongoose.model('User', userSchema);