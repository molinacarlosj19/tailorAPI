// entities/ProductOrder.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ProductOrder = sequelize.define('ProductOrder', {
    order_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    order_date: {
        type: DataTypes.DATE,
        allowNull: false
    },
    order_number: {
        type: DataTypes.STRING,
        allowNull: false
    },
    time_in: {
        type: DataTypes.TIME,
        allowNull: false
    },
    time_out: {
        type: DataTypes.TIME,
        allowNull: false
    }
}, {
    tableName: 'product_orders',
    timestamps: false
});

module.exports = ProductOrder;
