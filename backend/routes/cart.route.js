const express = require('express');
const { syncCart, getCart, updateCart } = require('../controllers/cart.controller');
const { isAuthenticated } = require('../middleware/middlewares');

const router = express.Router();

router.post('/sync', isAuthenticated, syncCart);
router.get('/', isAuthenticated, getCart);
router.put('/', isAuthenticated, updateCart);

module.exports = router;
