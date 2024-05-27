const pool = require('../config/database');
const Product = require('../entities/Product');

class ProductService {
    constructor() {
        this.pool = pool;
    }

    async createProduct(productCode, productName) {
        const client = await this.pool.connect();
        try {
            const query = 'INSERT INTO products (product_code, product_name) VALUES ($1, $2) RETURNING *';
            const values = [productCode, productName];
            const result = await client.query(query, values);
            const createdProduct = result.rows[0];
            return new Product(createdProduct.product_id, createdProduct.product_code, createdProduct.product_name);
        } finally {
            client.release();
        }
    }

    async getAllProducts() {
        const client = await this.pool.connect();
        try {
            const result = await client.query('SELECT * FROM products');
            return result.rows.map(row => new Product(row.product_id, row.product_code, row.product_name));
        } finally {
            client.release();
        }
    }

    async getProductById(productId) {
        const client = await this.pool.connect();
        try {
            const query = 'SELECT * FROM products WHERE product_id = $1';
            const result = await client.query(query, [productId]);
            const productData = result.rows[0];
            if (!productData) {
                throw new Error('Product not found');
            }
            return new Product(productData.product_id, productData.product_code, productData.product_name);
        } finally {
            client.release();
        }
    }

    async updateProduct(productId, newData) {
        const client = await this.pool.connect();
        try {
            const query = 'UPDATE products SET product_code = $1, product_name = $2 WHERE product_id = $3 RETURNING *';
            const values = [newData.productCode, newData.productName, productId];
            const result = await client.query(query, values);
            const updatedProduct = result.rows[0];
            if (!updatedProduct) {
                throw new Error('Product not found');
            }
            return new Product(updatedProduct.product_id, updatedProduct.product_code, updatedProduct.product_name);
        } finally {
            client.release();
        }
    }

    async deleteProduct(productId) {
        const client = await this.pool.connect();
        try {
            const query = 'DELETE FROM products WHERE product_id = $1';
            await client.query(query, [productId]);
        } finally {
            client.release();
        }
    }
}

module.exports = ProductService;
