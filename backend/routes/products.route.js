const express = require('express');
const router = express.Router();
const { getAllProducts, getProductByProductId, getFilterOptions, getProductById } = require('../controllers/product.controller.js');

router.get('/', getAllProducts);

router.get('/:id', getProductById);

router.get('/filters/options', getFilterOptions);

module.exports = router;    