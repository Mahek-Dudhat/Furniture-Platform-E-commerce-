const { required } = require('joi');
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Product name is required'],
        trim: true,
        maxlength: [120, 'Product name should not be more than 120 characters']
    },
    description: {
        type: String,
        required: [true, 'Please enter product description'],
        maxLength: [2000, 'Description cannot exceed 2000 characters']
    },
    price: {
        type: Number,
        required: [true, 'Please enter product price'],
        min: [0, 'Price cannot be negative']
    },
    discount: {
        type: Number,
        default: 0,
    },
    images: [
        {
            public_id: {
                type: String,
                required: true
            }
            ,
            url: {
                type: String,
                required: true
            }
        }
    ],
    category: {
        type: String,
        required: [true, 'Please select category'],
        enum: ['Sofa', 'Chair', 'Table', 'Bed', 'cabinet', 'lighting', 'decor', 'outdoor', 'Storage', 'Ottoman'],
    },
    inStock: {
        type: Boolean,
        default: true
    },
    stock: {
        type: Number,
        required: [true, 'Please add some stock'],
        min: [0, 'Stock cannot be negative'],
        default: 0,
    },
    color: {
        type: String,
        required: true,
    },
    material: {
        type: String,
        required: true
    },
    brand: {
        type: String,
        default: 'Aura Vista',
    },
    rating: {
        average: {
            type: Number,
            default: 0,
            min: 0,
            max: 5,
        },
        count: {
            type: Number,
            default: 0,
        },
    },
    reviews: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Review'
        }
    ],
    warranty: {
        type: String,
    },

}, {
    timestamps: true
})

//Index for faster searches:
productSchema.index({ name: 'text', description: 'text' });
productSchema.index({ category: 1 });

module.exports = mongoose.model('Product', productSchema);