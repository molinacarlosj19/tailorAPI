const express = require('express');
const ProductOrderController = require('../controllers/ProductOrderController');

const router = express.Router();
const productOrderController = new ProductOrderController();

router.post('/', productOrderController.createProductOrder);
router.get('/', productOrderController.getAllProductOrders);
router.get('/:id', productOrderController.getProductOrderById);
router.put('/:id', productOrderController.updateProductOrder);
router.delete('/:id', productOrderController.deleteProductOrder);

module.exports = router;
