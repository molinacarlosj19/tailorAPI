const pool = require('../config/database');
const ProductOrder = require('../entities/ProductOrder');
const ProductOrderProduct = require('../entities/ProductOrderProduct');

class ProductOrderService {
    constructor() {
        this.pool = pool;
    }

    async createProductOrder(orderDate, orderNumber, timeIn, timeOut, productsData) {
        const client = await this.pool.connect();
        try {
            await client.query('BEGIN');

            const insertOrderQuery = 'INSERT INTO product_orders (order_date, order_number, time_in, time_out) VALUES ($1, $2, $3, $4) RETURNING order_id';
            const insertOrderValues = [orderDate, orderNumber, timeIn, timeOut];
            const { rows: [{ order_id }] } = await client.query(insertOrderQuery, insertOrderValues);

            for (const productData of productsData) {
                const insertOrderProductQuery = 'INSERT INTO product_order_products (order_id, product_id, quantity, expiration_date) VALUES ($1, $2, $3, $4)';
                const insertOrderProductValues = [order_id, productData.productId, productData.quantity, productData.expirationDate];
                await client.query(insertOrderProductQuery, insertOrderProductValues);
            }

            await client.query('COMMIT');

            return new ProductOrder(order_id, orderDate, orderNumber, timeIn, timeOut);
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }

    async getProductOrderById(orderId) {
        const client = await this.pool.connect();
        try {
            const orderQuery = 'SELECT * FROM product_orders WHERE order_id = $1';
            const orderResult = await client.query(orderQuery, [orderId]);
            const orderData = orderResult.rows[0];
            if (!orderData) {
                throw new Error('Order not found');
            }

            const productsQuery = 'SELECT * FROM product_order_products WHERE order_id = $1';
            const productsResult = await client.query(productsQuery, [orderId]);
            const productsData = productsResult.rows;

            const productOrder = new ProductOrder(orderData.order_id, orderData.order_date, orderData.order_number, orderData.time_in, orderData.time_out);
            productOrder.products = productsData.map(product => new ProductOrderProduct(
                product.product_order_product_id,
                product.order_id,
                product.product_id,
                product.quantity,
                product.expiration_date
            ));

            return productOrder;
        } finally {
            client.release();
        }
    }

    async getAllProductOrders() {
        const client = await this.pool.connect();
        try {
            const ordersQuery = 'SELECT * FROM product_orders';
            const ordersResult = await client.query(ordersQuery);
            const ordersData = ordersResult.rows;

            const orders = [];
            for (const orderData of ordersData) {
                const productsQuery = 'SELECT * FROM product_order_products WHERE order_id = $1';
                const productsResult = await client.query(productsQuery, [orderData.order_id]);
                const productsData = productsResult.rows;

                const productOrder = new ProductOrder(orderData.order_id, orderData.order_date, orderData.order_number, orderData.time_in, orderData.time_out);
                productOrder.products = productsData.map(product => new ProductOrderProduct(
                    product.product_order_product_id,
                    product.order_id,
                    product.product_id,
                    product.quantity,
                    product.expiration_date
                ));

                orders.push(productOrder);
            }

            return orders;
        } finally {
            client.release();
        }
    }

    async updateProductOrder(orderId, newData) {
        const client = await this.pool.connect();
        try {
            await client.query('BEGIN');

            const updateOrderQuery = 'UPDATE product_orders SET order_date = $1, order_number = $2, time_in = $3, time_out = $4 WHERE order_id = $5';
            const updateOrderValues = [newData.orderDate, newData.orderNumber, newData.timeIn, newData.timeOut, orderId];
            await client.query(updateOrderQuery, updateOrderValues);

            const deleteProductsQuery = 'DELETE FROM product_order_products WHERE order_id = $1';
            await client.query(deleteProductsQuery, [orderId]);

            for (const productData of newData.products) {
                const insertOrderProductQuery = 'INSERT INTO product_order_products (order_id, product_id, quantity, expiration_date) VALUES ($1, $2, $3, $4)';
                const insertOrderProductValues = [orderId, productData.productId, productData.quantity, productData.expirationDate];
                await client.query(insertOrderProductQuery, insertOrderProductValues);
            }

            await client.query('COMMIT');

            return new ProductOrder(orderId, newData.orderDate, newData.orderNumber, newData.timeIn, newData.timeOut);
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
            const deleteProductsQuery = 'DELETE FROM product_order_products WHERE order_id = $1';
            await client.query(deleteProductsQuery, [orderId]);

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
