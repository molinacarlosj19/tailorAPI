const sequelize = require('../config/database');
const InvoiceLineItem = require('../entities/InvoiceLineItem');
const InvoiceProductSource = require('../entities/InvoiceProductSource');

class InvoiceLineItemService {
    async createInvoiceLineItem(invoiceId, productId, quantity, sources) {
        const transaction = await sequelize.transaction();
        try {
            const lineItem = await InvoiceLineItem.create({
                invoice_id: invoiceId,
                product_id: productId,
                quantity
            }, { transaction });

            for (const source of sources) {
                await InvoiceProductSource.create({
                    invoice_line_item_id: lineItem.invoice_line_item_id,
                    product_order_product_id: source.productOrderProductId,
                    quantity: source.quantity,
                    expiration_date: source.expirationDate
                }, { transaction });
            }

            await transaction.commit();
            return lineItem;
        } catch (error) {
            await transaction.rollback();
            console.error('Error creating InvoiceLineItem:', error);
            throw error;
        }
    }

    async getInvoiceLineItemById(invoiceLineItemId) {
        const lineItem = await InvoiceLineItem.findByPk(invoiceLineItemId, {
            include: [InvoiceProductSource] // Assuming InvoiceProductSource is the association
        });
        return lineItem;
    }

    async getAllInvoiceLineItems() {
        const lineItems = await InvoiceLineItem.findAll({
            include: [InvoiceProductSource] // Assuming InvoiceProductSource is the association
        });
        return lineItems;
    }

    async updateInvoiceLineItem(invoiceLineItemId, newData) {
        const transaction = await sequelize.transaction();
        try {
            const lineItem = await InvoiceLineItem.findByPk(invoiceLineItemId, { transaction });
            if (!lineItem) {
                throw new Error('Invoice Line Item not found');
            }

            lineItem.product_id = newData.productId;
            lineItem.quantity = newData.quantity;
            await lineItem.save({ transaction });

            await InvoiceProductSource.destroy({ where: { invoice_line_item_id: invoiceLineItemId }, transaction });

            for (const source of newData.sources) {
                await InvoiceProductSource.create({
                    invoice_line_item_id: invoiceLineItemId,
                    product_order_product_id: source.productOrderProductId,
                    quantity: source.quantity,
                    expiration_date: source.expirationDate
                }, { transaction });
            }

            await transaction.commit();
            return lineItem;
        } catch (error) {
            await transaction.rollback();
            console.error('Error updating InvoiceLineItem:', error);
            throw error;
        }
    }

    async deleteInvoiceLineItem(invoiceLineItemId) {
        const transaction = await sequelize.transaction();
        try {
            await InvoiceProductSource.destroy({ where: { invoice_line_item_id: invoiceLineItemId }, transaction });
            await InvoiceLineItem.destroy({ where: { invoice_line_item_id: invoiceLineItemId }, transaction });
            await transaction.commit();
        } catch (error) {
            await transaction.rollback();
            console.error('Error deleting InvoiceLineItem:', error);
            throw error;
        }
    }
}

module.exports = InvoiceLineItemService;
