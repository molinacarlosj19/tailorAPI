// controllers/ProductOrderController.js
const ProductOrderService = require('../services/ProductOrderService');

class ProductOrderController {
    constructor() {
        this.productOrderService = new ProductOrderService();
    }

    async createProductOrder(req, res, next) {
        try {
            const { orderDate, orderNumber, timeIn, timeOut, products } = req.body;
            const productOrder = await this.productOrderService.createProductOrder(orderDate, orderNumber, timeIn, timeOut, products);
            res.status(201).json(productOrder);
        } catch (error) {
            next(error);
        }
    }

    async getProductOrderById(req, res, next) {
        try {
            const orderId = parseInt(req.params.id, 10);
            if (isNaN(orderId)) {
                return res.status(400).json({ error: 'Invalid order ID' });
            }
            const productOrder = await this.productOrderService.getProductOrderById(orderId);
            res.status(200).json(productOrder);
        } catch (error) {
            next(error);
        }
    }

    async getProductOrdersByProductId(req, res, next) {
        try {
          const productId = parseInt(req.params.productId, 10);
          if (isNaN(productId)) {
            return res.status(400).json({ error: 'Invalid product ID' });
          }
          const productOrders = await this.productOrderService.getProductOrdersByProductId(productId);
          res.status(200).json(productOrders);
        } catch (error) {
          next(error);
        }
      }

    async getAllProductOrders(req, res, next) {
        try {
            const productOrders = await this.productOrderService.getAllProductOrders();
            res.status(200).json(productOrders);
        } catch (error) {
            next(error);
        }
    }

    async updateProductOrder(req, res, next) {
        try {
            const orderId = parseInt(req.params.id, 10);
            if (isNaN(orderId)) {
                return res.status(400).json({ error: 'Invalid order ID' });
            }
            const newData = req.body;
            const updatedProductOrder = await this.productOrderService.updateProductOrder(orderId, newData);
            res.status(200).json(updatedProductOrder);
        } catch (error) {
            next(error);
        }
    }

    async deleteProductOrder(req, res, next) {
        try {
            const orderId = parseInt(req.params.id, 10);
            if (isNaN(orderId)) {
                return res.status(400).json({ error: 'Invalid order ID' });
            }
            await this.productOrderService.deleteProductOrder(orderId);
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    }

    async getAllProductOrderProducts(req, res, next) {
        try {
            const productOrderProducts = await this.productOrderService.getAllProductOrderProducts();
            res.status(200).json(productOrderProducts);
        } catch (error) {
            next(error);
        }
    }
}

module.exports = ProductOrderController;
