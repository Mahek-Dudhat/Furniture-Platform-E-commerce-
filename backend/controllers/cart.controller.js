const Cart = require('../models/cart.model.js');
const asyncHandler = require('../utils/asyncHandler.js');
const CustomErrorHandler = require('../utils/CustomErrorHandler');


const syncCart = asyncHandler(
    async (req, res) => {
        const { items } = req.body;

        if (!items || !Array.isArray(items)) {
            throw new CustomErrorHandler(400, 'Invalid cart items');
        }

        const userId = req.user._id;

        let cart = await Cart.findOne({ user: userId });

        if (!cart) {
            cart = new Cart({ user: userId, items: [] });
        }

        // Merge local cart with server cart
        items.forEach((localItem) => {
            const existingItem = cart.items.find((item) => item.product.toString() === localItem.productId);

            if (existingItem) {
                existingItem.quantity += localItem.quantity;
            } else {
                cart.items.push({
                    product: localItem.productId,
                    quantity: localItem.quantity,
                    price: localItem.price
                });
            }
        });

        cart.totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);
        cart.totalPrice = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

        await cart.save();
        await cart.populate('items.product');

        res.status(200).json({ success: true, data: cart });

    }
)

const getCart = asyncHandler(
    async (req, res) => {
        console.log('Req id:', req.user._id);
        const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');

        if (!cart) {
            return res.status(200).json({ success: true, data: { items: [] } });
        }

        res.status(200).json({ success: true, data: cart });
    }
)

const updateCart = asyncHandler(
    async (req, res) => {
        const { items } = req.body;

        console.log('Req id:', req.user._id);

        if (!items || !Array.isArray(items)) {
            throw new CustomErrorHandler(400, 'Invalid cart items');
        }

        let cart = await Cart.findOne({ user: req.user._id });

        if (!cart) {
            cart = new Cart({ user: req.user._id, items: [] });
        }

        cart.items = items.map((item) => ({
            product: item.productId,
            quantity: item.quantity,
            price: item.price
        }));

        cart.totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);
        cart.totalPrice = cart.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

        await cart.save();
        await cart.populate('items.product');

        res.status(200).json({ success: true, data: cart });
    }
)

module.exports = {
    syncCart,
    getCart,
    updateCart
}