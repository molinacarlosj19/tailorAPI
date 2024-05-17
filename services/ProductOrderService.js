// services/ProductOrderService.js
const pool = require('../config/database');
const ProductService = require('./ProductService');

class ProductOrderService {
    constructor() {
        this.pool = pool;
        this.productService = new ProductService();
    }

    async createProductOrder(orderDate, status, productsData) {
        let totalAmount = 0;
        for (const productData of productsData) {
            const product = await this.productService.getProductById(productData.productId);
            totalAmount += product.unitPrice * productData.quantity;
        }

        const client = await this.pool.connect();
        try {
            await client.query('BEGIN');

            const insertOrderQuery = 'INSERT INTO product_orders (order_date, total_amount, status) VALUES ($1, $2, $3) RETURNING order_id';
            const insertOrderValues = [orderDate, totalAmount, status];
            const { rows: [{ order_id }] } = await client.query(insertOrderQuery, insertOrderValues);

            for (const productData of productsData) {
                const insertOrderProductQuery = 'INSERT INTO product_order_products (order_id, product_id, quantity) VALUES ($1, $2, $3)';
                const insertOrderProductValues = [order_id, productData.productId, productData.quantity];
                await client.query(insertOrderProductQuery, insertOrderProductValues);
            }

            await client.query('COMMIT');

            return new ProductOrder(orderDate, totalAmount, status);
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }
    
    // Other methods remain similar
}

module.exports = ProductOrderService;
