const pool = require('../config/database');
const Product = require('../entities/Product');

class ProductService {
    constructor() {
        this.pool = pool;
    }

    async createProduct(productCode, productName, expirationDate) {
        const client = await this.pool.connect();
        try {
            const query = 'INSERT INTO products (product_code, product_name, expiration_date) VALUES ($1, $2, $3) RETURNING *';
            const values = [productCode, productName, expirationDate];
            const result = await client.query(query, values);
            const createdProduct = result.rows[0];
            return new Product(createdProduct.product_code, createdProduct.product_name, createdProduct.expiration_date);
        } finally {
            client.release();
        }
    }

    async getAllProducts() {
        const client = await this.pool.connect();
        try {
            const result = await client.query('SELECT * FROM products');
            const products = result.rows.map(row => new Product(row.product_code, row.product_name, row.expiration_date));
            return products;
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
            return new Product(productData.product_code, productData.product_name, productData.expiration_date);
        } finally {
            client.release();
        }
    }

    async updateProduct(productId, newData) {
        const client = await this.pool.connect();
        try {
            const query = 'UPDATE products SET product_code = $1, product_name = $2, expiration_date = $3 WHERE product_id = $4 RETURNING *';
            const values = [newData.productCode, newData.productName, newData.expirationDate, productId];
            const result = await client.query(query, values);
            const updatedProduct = result.rows[0];
            if (!updatedProduct) {
                throw new Error('Product not found');
            }
            return new Product(updatedProduct.product_code, updatedProduct.product_name, updatedProduct.expiration_date);
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
