// entities/ProductOrderProduct.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const ProductOrder = require('./ProductOrder');
const Product = require('./Product');

const ProductOrderProduct = sequelize.define('ProductOrderProduct', {
    product_order_product_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    order_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: ProductOrder,
            key: 'order_id'
        }
    },
    product_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Product,
            key: 'product_id'
        }
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    expiration_date: {
        type: DataTypes.DATE,
        allowNull: false
    }
}, {
    tableName: 'product_order_products',
    timestamps: false
});

// Establish relationships
ProductOrder.hasMany(ProductOrderProduct, { foreignKey: 'order_id' });
ProductOrderProduct.belongsTo(ProductOrder, { foreignKey: 'order_id' });

ProductOrderProduct.belongsTo(Product, { foreignKey: 'product_id' });
Product.hasMany(ProductOrderProduct, { foreignKey: 'product_id' });

module.exports = ProductOrderProduct;
