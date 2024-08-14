// Invoice.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const InvoiceLineItem = require('./InvoiceLineItem');

const Invoice = sequelize.define('Invoice', {
    invoice_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    invoice_date: {
        type: DataTypes.DATE,
        allowNull: false
    },
    selector: {
        type: DataTypes.STRING,
        allowNull: false
    },
    checker: {
        type: DataTypes.STRING,
        allowNull: false
    },
    driver: {
        type: DataTypes.STRING,
        allowNull: false
    },
    received_by: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    tableName: 'invoices',
    timestamps: false
});

Invoice.hasMany(InvoiceLineItem, { as: 'lineItems', foreignKey: 'invoice_id' });
InvoiceLineItem.belongsTo(Invoice, { foreignKey: 'invoice_id' });

module.exports = Invoice;
