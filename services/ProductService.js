// services/ProductService.js
const { Op } = require('sequelize');
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
        if (isNaN(productId)) {
            throw new Error('Invalid product ID');
        }
        const product = await Product.findByPk(productId);
        if (!product) {
            throw new Error('Product not found');
        }
        return product;
    }

    async getProductsByIds(ids) {
        const products = await Product.findAll({
            where: {
                product_id: ids
            }
        });
        return products;
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

    async searchProductsByCode(code) {
        const products = await Product.findAll({
            where: {
                product_code: {
                    [Op.like]: `%${code}%`
                }
            }
        });
        return products;
    }

}

module.exports = ProductService;
