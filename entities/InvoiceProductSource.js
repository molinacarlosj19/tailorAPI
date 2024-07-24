const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const InvoiceLineItem = require('./InvoiceLineItem');
const ProductOrderProduct = require('./ProductOrderProduct');

const InvoiceProductSource = sequelize.define('InvoiceProductSource', {
    invoice_product_source_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    invoice_line_item_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: InvoiceLineItem,
            key: 'invoice_line_item_id'
        }
    },
    product_order_product_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: ProductOrderProduct,
            key: 'product_order_product_id'
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
    tableName: 'invoice_product_sources',
    timestamps: false
});

module.exports = InvoiceProductSource;
