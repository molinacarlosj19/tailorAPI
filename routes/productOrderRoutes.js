// routes/productOrderRoutes.js
const express = require('express');
const ProductOrderController = require('../controllers/ProductOrderController');

const router = express.Router();
const productOrderController = new ProductOrderController();

router.post('/product-orders', productOrderController.createProductOrder);

module.exports = router;
