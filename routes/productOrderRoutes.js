// routes/productOrderRoutes.js

const express = require('express');
const ProductOrderController = require('../controllers/ProductOrderController');

const router = express.Router();
const productOrderController = new ProductOrderController();

router.post('/', (req, res, next) => productOrderController.createProductOrder(req, res, next));
router.get('/', (req, res, next) => productOrderController.getAllProductOrders(req, res, next));
router.get('/products', (req, res, next) => productOrderController.getAllProductOrderProducts(req, res, next));
router.get('/by-product/:productId', (req, res, next) => productOrderController.getProductOrdersByProductId(req, res, next));
router.get('/:id', (req, res, next) => productOrderController.getProductOrderById(req, res, next));
router.put('/:id', (req, res, next) => productOrderController.updateProductOrder(req, res, next));
router.delete('/:id', (req, res, next) => productOrderController.deleteProductOrder(req, res, next));

module.exports = router;
