const sequelize = require('../config/database');
const Invoice = require('./Invoice');
const InvoiceLineItem = require('./InvoiceLineItem');
const Product = require('./Product');
const ProductOrder = require('./ProductOrder');
const ProductOrderProduct = require('./ProductOrderProduct');
const InvoiceProductSource = require('./InvoiceProductSource');

// Invoice associations
Invoice.hasMany(InvoiceLineItem, { foreignKey: 'invoice_id' });
InvoiceLineItem.belongsTo(Invoice, { foreignKey: 'invoice_id' });

// Product associations
Product.hasMany(InvoiceLineItem, { foreignKey: 'product_id' });
InvoiceLineItem.belongsTo(Product, { foreignKey: 'product_id' });

// ProductOrder associations
ProductOrder.hasMany(ProductOrderProduct, { foreignKey: 'order_id' });
ProductOrderProduct.belongsTo(ProductOrder, { foreignKey: 'order_id' });

// ProductOrderProduct associations
ProductOrderProduct.hasMany(InvoiceProductSource, { foreignKey: 'product_order_product_id' });
InvoiceProductSource.belongsTo(ProductOrderProduct, { foreignKey: 'product_order_product_id' });

// InvoiceLineItem associations
InvoiceLineItem.hasMany(InvoiceProductSource, { foreignKey: 'invoice_line_item_id' });
InvoiceProductSource.belongsTo(InvoiceLineItem, { foreignKey: 'invoice_line_item_id' });

module.exports = {
    sequelize,
    Invoice,
    InvoiceLineItem,
    Product,
    ProductOrder,
    ProductOrderProduct,
    InvoiceProductSource
};
