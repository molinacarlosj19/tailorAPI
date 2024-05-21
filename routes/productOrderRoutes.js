const express = require('express');
const ProductOrderController = require('../controllers/ProductOrderController');

const router = express.Router();
const productOrderController = new ProductOrderController();

router.post('/product-orders', (req, res) => productOrderController.createProductOrder(req, res));

module.exports = router;
