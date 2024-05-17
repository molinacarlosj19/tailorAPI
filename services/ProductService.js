// services/ProductService.js
const pool = require('../config/database');
const { Product } = require('../models/Product');

console.log('ProductService loaded');

class ProductService {
    constructor() {
        this.pool = pool;
    }

    async createProduct(productName, unitPrice, expirationDate) {
        const client = await this.pool.connect();
        try {
            const query = 'INSERT INTO products (product_name, unit_price, expiration_date) VALUES ($1, $2, $3) RETURNING *';
            const values = [productName, unitPrice, expirationDate];
            const result = await client.query(query, values);
            const createdProduct = result.rows[0];
            return new Product(createdProduct.product_id, createdProduct.product_name, createdProduct.unit_price, createdProduct.expiration_date);
        } finally {
            client.release();
        }
    }

    async getAllProducts() {
        console.log("Started getAllProducts ProductService");
        const client = await this.pool.connect();
        try {
            const result = await client.query('SELECT * FROM products');
            const products = result.rows.map(row => new Product(row.product_id, row.product_name, row.unit_price, row.expiration_date));
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
            return new Product(productData.product_id, productData.product_name, productData.unit_price, productData.expiration_date);
        } finally {
            client.release();
        }
    }

    async updateProduct(productId, newData) {
        const client = await this.pool.connect();
        try {
            const query = 'UPDATE products SET product_name = $1, unit_price = $2, expiration_date = $3 WHERE product_id = $4 RETURNING *';
            const values = [newData.productName, newData.unitPrice, newData.expirationDate, productId];
            const result = await client.query(query, values);
            const updatedProduct = result.rows[0];
            if (!updatedProduct) {
                throw new Error('Product not found');
            }
            return new Product(updatedProduct.product_id, updatedProduct.product_name, updatedProduct.unit_price, updatedProduct.expiration_date);
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
