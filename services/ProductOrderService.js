const pool = require('../config/database');
const ProductOrder = require('../entities/ProductOrder');
const ProductService = require('./ProductService');

class ProductOrderService {
    constructor() {
        this.pool = pool;
        this.productService = new ProductService();
    }

    async createProductOrder(orderDate, orderNumber, timeIn, timeOut, productsData) {
        const client = await this.pool.connect();
        try {
            await client.query('BEGIN');

            const insertOrderQuery = `
                INSERT INTO product_orders (order_date, order_number, time_in, time_out)
                VALUES ($1, $2, $3, $4)
                RETURNING order_id`;
            const insertOrderValues = [orderDate, orderNumber, timeIn, timeOut];
            const { rows: [{ order_id }] } = await client.query(insertOrderQuery, insertOrderValues);

            for (const productData of productsData) {
                const insertOrderProductQuery = `
                    INSERT INTO product_order_products (order_id, product_id, quantity)
                    VALUES ($1, $2, $3)`;
                const insertOrderProductValues = [order_id, productData.productId, productData.quantity];
                await client.query(insertOrderProductQuery, insertOrderProductValues);
            }

            await client.query('COMMIT');

            return new ProductOrder(orderDate, orderNumber, timeIn, timeOut, productsData);
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }

    async getAllProductOrders() {
        const client = await this.pool.connect();
        try {
            const result = await client.query('SELECT * FROM product_orders');
            return result.rows.map(row => new ProductOrder(row.order_date, row.order_number, row.time_in, row.time_out));
        } finally {
            client.release();
        }
    }

    async getProductOrderById(orderId) {
        const client = await this.pool.connect();
        try {
            const orderResult = await client.query('SELECT * FROM product_orders WHERE order_id = $1', [orderId]);
            const productResult = await client.query('SELECT * FROM product_order_products WHERE order_id = $1', [orderId]);

            if (orderResult.rows.length === 0) {
                throw new Error('Order not found');
            }

            const orderData = orderResult.rows[0];
            const products = productResult.rows.map(row => ({ productId: row.product_id, quantity: row.quantity }));
            
            return new ProductOrder(orderData.order_date, orderData.order_number, orderData.time_in, orderData.time_out, products);
        } finally {
            client.release();
        }
    }

    async updateProductOrder(orderId, orderDate, orderNumber, timeIn, timeOut, productsData) {
        const client = await this.pool.connect();
        try {
            await client.query('BEGIN');

            const updateOrderQuery = `
                UPDATE product_orders
                SET order_date = $1, order_number = $2, time_in = $3, time_out = $4
                WHERE order_id = $5`;
            const updateOrderValues = [orderDate, orderNumber, timeIn, timeOut, orderId];
            await client.query(updateOrderQuery, updateOrderValues);

            const deleteOrderProductsQuery = 'DELETE FROM product_order_products WHERE order_id = $1';
            await client.query(deleteOrderProductsQuery, [orderId]);

            for (const productData of productsData) {
                const insertOrderProductQuery = `
                    INSERT INTO product_order_products (order_id, product_id, quantity)
                    VALUES ($1, $2, $3)`;
                const insertOrderProductValues = [orderId, productData.productId, productData.quantity];
                await client.query(insertOrderProductQuery, insertOrderProductValues);
            }

            await client.query('COMMIT');

            return new ProductOrder(orderDate, orderNumber, timeIn, timeOut, productsData);
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }

    async deleteProductOrder(orderId) {
        const client = await this.pool.connect();
        try {
            await client.query('BEGIN');

            const deleteOrderProductsQuery = 'DELETE FROM product_order_products WHERE order_id = $1';
            await client.query(deleteOrderProductsQuery, [orderId]);

            const deleteOrderQuery = 'DELETE FROM product_orders WHERE order_id = $1';
            await client.query(deleteOrderQuery, [orderId]);

            await client.query('COMMIT');
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }
}

module.exports = ProductOrderService;
