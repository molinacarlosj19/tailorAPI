// services/ProductOrderService.js
const sequelize = require('../config/database');
const ProductOrder = require('../entities/ProductOrder');
const ProductOrderProduct = require('../entities/ProductOrderProduct');
const Product = require('../entities/Product');

class ProductOrderService {
    async createProductOrder(orderDate, orderNumber, timeIn, timeOut, productsData) {
        const result = await sequelize.transaction(async (t) => {
            const productOrder = await ProductOrder.create({
                order_date: orderDate,
                order_number: orderNumber,
                time_in: timeIn,
                time_out: timeOut
            }, { transaction: t });

            for (const productData of productsData) {
                await ProductOrderProduct.create({
                    order_id: productOrder.order_id,
                    product_id: productData.productId,
                    quantity: productData.quantity,
                    expiration_date: productData.expirationDate
                }, { transaction: t });
            }

            return productOrder;
        });

        return result;
    }

    async getProductOrderById(orderId) {
        if (isNaN(orderId)) {
            throw new Error('Invalid order ID');
        }

        const productOrder = await ProductOrder.findByPk(orderId, {
            include: ProductOrderProduct
        });

        if (!productOrder) {
            throw new Error('Order not found');
        }
        return productOrder;
    }

    async getProductOrdersByProductId(productId) {
        const productOrders = await ProductOrderProduct.findAll({
          where: { product_id: productId },
          include: [{ model: ProductOrder }]
        });
        return productOrders;
      }

    async getAllProductOrders() {
        const productOrders = await ProductOrder.findAll({
            include: ProductOrderProduct
        });
        return productOrders;
    }

    async getAllProductOrderProducts() {
        try {
            const productOrderProducts = await ProductOrderProduct.findAll({
                include: [Product],
            });
            return productOrderProducts;
        } catch (error) {
            console.error('Error fetching product order products:', error.message);
            throw error;
        }
    }

    async updateProductOrder(orderId, newData) {
        const result = await sequelize.transaction(async (t) => {
            const productOrder = await ProductOrder.findByPk(orderId, { transaction: t });
            if (!productOrder) {
                throw new Error('Order not found');
            }

            productOrder.order_date = newData.orderDate;
            productOrder.order_number = newData.orderNumber;
            productOrder.time_in = newData.timeIn;
            productOrder.time_out = newData.timeOut;
            await productOrder.save({ transaction: t });

            await ProductOrderProduct.destroy({ where: { order_id: orderId }, transaction: t });

            for (const productData of newData.products) {
                await ProductOrderProduct.create({
                    order_id: orderId,
                    product_id: productData.productId,
                    quantity: productData.quantity,
                    expiration_date: productData.expirationDate
                }, { transaction: t });
            }

            return productOrder;
        });

        return result;
    }

    async deleteProductOrder(orderId) {
        await sequelize.transaction(async (t) => {
            await ProductOrderProduct.destroy({ where: { order_id: orderId }, transaction: t });
            await ProductOrder.destroy({ where: { order_id: orderId }, transaction: t });
        });
    }
}

module.exports = ProductOrderService;
