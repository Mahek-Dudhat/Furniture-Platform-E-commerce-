const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    orderNumber: {
        type: String,
        unique: true
    },
    items: [{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true,
        },
        name: String,
        image: String,
        quantity: {
            type: Number,
            required: true,
            min: 1,
        },
        price: {
            type: Number,
            required: true
        }
    }],
    shippingAddress: {
        fullName: { type: String, required: true },
        phone: { type: String, required: true },
        addressLine1: { type: String, required: true },
        addressLine2: String,
        city: { type: String, required: true },
        state: { type: String, required: true },
        pincode: { type: String, required: true },
        landmark: String
    },
    billingAddress: {
        fullName: String,
        phone: String,
        addressLine1: String,
        addressLine2: String,
        city: String,
        state: String,
        pincode: String
    },
    paymentInfo: {
        method: {
            type: String,
            enum: ['razorpay', 'cod', 'card', 'upi'],
            required: true
        },
        razorpayOrderId: String,
        razorpayPaymentId: String,
        razorpaySignature: String,
        status: {
            type: String,
            enum: ['pending', 'completed', 'failed', 'refunded'],
            default: 'pending'
        },
        paidAt: Date
    },
    pricing: {
        subtotal: {
            type: Number,
            required: true
        },
        tax: {
            type: Number,
            default: 0
        },
        shippingCharge: {
            type: Number,
            default: 0
        },
        discount: {
            type: Number,
            default: 0
        },
        total: {
            type: Number,
            required: true
        }
    },
    coupon: {
        code: String,
        discount: Number
    },
    orderStatus: {
        type: String,
        enum: ['pending', 'confirmed', 'processing', 'shipped', 'out-for-delivery', 'delivered', 'cancelled', 'returned'],
        default: 'pending'
    },
    statusHistory: [{
        status: String,
        timestamp: Date,
        note: String
    }],
    trackingInfo: {
        trackingNumber: String,
        courier: String,
        trackingUrl: String
    },
    deliveredAt: Date,
    cancelledAt: Date,
    cancellationReason: String,
    notes: String,
    invoice: {
        invoiceNumber: String,
        invoiceDate: Date,
        invoiceUrl: String
    }
},
    {
        timestamps: true
    });

// Generate order number before saving
orderSchema.pre('save', function () {
    if (!this.orderNumber) {
        this.orderNumber = `ORD${Date.now()}${Math.floor(Math.random() * 1000)}`;
    }
    /// next();
});

orderSchema.index({ user: 1, createdAt: -1 });
orderSchema.index({ orderNumber: 1 });

module.exports = mongoose.model('Order', orderSchema);
