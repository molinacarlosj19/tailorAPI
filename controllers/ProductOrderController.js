const ProductOrderService = require('../services/ProductOrderService');

class ProductOrderController {
    constructor() {
        this.productOrderService = new ProductOrderService();
    }

    async createProductOrder(req, res, next) {
        try {
            const { orderDate, orderNumber, timeIn, timeOut, products } = req.body;
            const newOrder = await this.productOrderService.createProductOrder(orderDate, orderNumber, timeIn, timeOut, products);
            res.status(201).json(newOrder);
        } catch (error) {
            next(error);
        }
    }

    async getAllProductOrders(req, res, next) {
        try {
            const orders = await this.productOrderService.getAllProductOrders();
            res.json(orders);
        } catch (error) {
            next(error);
        }
    }

    async getProductOrderById(req, res, next) {
        try {
            const orderId = req.params.id;
            const order = await this.productOrderService.getProductOrderById(orderId);
            res.json(order);
        } catch (error) {
            next(error);
        }
    }

    async updateProductOrder(req, res, next) {
        try {
            const orderId = req.params.id;
            const { orderDate, orderNumber, timeIn, timeOut, products } = req.body;
            const updatedOrder = await this.productOrderService.updateProductOrder(orderId, orderDate, orderNumber, timeIn, timeOut, products);
            res.json(updatedOrder);
        } catch (error) {
            next(error);
        }
    }

    async deleteProductOrder(req, res, next) {
        try {
            const orderId = req.params.id;
            await this.productOrderService.deleteProductOrder(orderId);
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    }
}

module.exports = ProductOrderController;
