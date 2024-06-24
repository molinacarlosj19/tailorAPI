// services/ProductService.js
const sequelize = require('../config/database');
const { DataTypes } = require('sequelize');

// Define the Product model using Sequelize
const Product = sequelize.define('Product', {
    product_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    product_code: {
        type: DataTypes.STRING,
        allowNull: false
    },
    product_name: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: 'products',
    timestamps: false
});

class ProductService {
    async createProduct(productCode, productName) {
        const createdProduct = await Product.create({
            product_code: productCode,
            product_name: productName
        });
        return createdProduct;
    }

    async getAllProducts() {
        const products = await Product.findAll();
        return products;
    }

    async getProductById(productId) {
        const product = await Product.findByPk(productId);
        if (!product) {
            throw new Error('Product not found');
        }
        return product;
    }

    async updateProduct(productId, newData) {
        const product = await Product.findByPk(productId);
        if (!product) {
            throw new Error('Product not found');
        }
        product.product_code = newData.productCode;
        product.product_name = newData.productName;
        await product.save();
        return product;
    }

    async deleteProduct(productId) {
        const product = await Product.findByPk(productId);
        if (!product) {
            throw new Error('Product not found');
        }
        await product.destroy();
    }
}

module.exports = ProductService;
