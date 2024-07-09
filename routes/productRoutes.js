const express = require('express');
const ProductController = require('../controllers/ProductController');

const router = express.Router();
const productController = new ProductController();

router.post('/', (req, res, next) => productController.createProduct(req, res, next));
router.get('/', (req, res, next) => productController.getAllProducts(req, res, next));
router.get('/:id', (req, res, next) => productController.getProductById(req, res, next));
router.put('/:id', (req, res, next) => productController.updateProduct(req, res, next));
router.delete('/:id', (req, res, next) => productController.deleteProduct(req, res, next));
router.get('/search', (req, res, next) => productController.searchProducts(req, res, next));

module.exports = router;
