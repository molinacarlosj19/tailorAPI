const express = require('express');
const ProductOrderController = require('../controllers/ProductOrderController');

const router = express.Router();
const productOrderController = new ProductOrderController();

router.post('/product-orders', (req, res, next) => productOrderController.createProductOrder(req, res, next));
router.get('/product-orders', (req, res, next) => productOrderController.getAllProductOrders(req, res, next));
router.get('/product-orders/:id', (req, res, next) => productOrderController.getProductOrderById(req, res, next));
router.put('/product-orders/:id', (req, res, next) => productOrderController.updateProductOrder(req, res, next));
router.delete('/product-orders/:id', (req, res, next) => productOrderController.deleteProductOrder(req, res, next));

module.exports = router;
