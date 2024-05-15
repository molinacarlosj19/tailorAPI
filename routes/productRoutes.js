// routes/productRoutes.js
const express = require('express');
const ProductController = require('../controllers/ProductController');

const router = express.Router();
const productController = new ProductController();

router.post('/products', productController.createProduct);
router.get('/products', productController.getAllProducts);
router.get('/products/:id', productController.getProductById);
router.put('/products/:id', productController.updateProduct);
router.delete('/products/:id', productController.deleteProduct);

module.exports = router;
