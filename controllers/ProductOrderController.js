const ProductOrderService = require('../services/ProductOrderService');

class ProductOrderController {
    constructor() {
        this.productOrderService = new ProductOrderService();
    }

    async createProductOrder(req, res) {
        try {
            const { orderDate, orderNumber, timeIn, timeOut, products } = req.body;
            const productOrder = await this.productOrderService.createProductOrder(orderDate, orderNumber, timeIn, timeOut, products);
            res.status(201).json(productOrder);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    // Other methods...
}

module.exports = ProductOrderController;
