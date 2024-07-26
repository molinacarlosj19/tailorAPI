const sequelize = require('../config/database');
const Invoice = require('../entities/Invoice');
const InvoiceLineItem = require('../entities/InvoiceLineItem');
const ProductOrderProduct = require('../entities/ProductOrderProduct');
const InvoiceProductSource = require('../entities/InvoiceProductSource');

class InvoiceService {
    async createInvoice(invoiceDate, selector, checker, driver, receivedBy, lineItems) {
        const transaction = await sequelize.transaction();
        try {
            console.log("Received data:", { invoiceDate, selector, checker, driver, receivedBy, lineItems });

            const invoice = await Invoice.create({
                invoice_date: invoiceDate,
                selector: selector,
                checker: checker,
                driver: driver,
                received_by: receivedBy
            }, { transaction });

            for (const item of lineItems) {
                const { productId, quantity, productSources } = item;
                let remainingQuantity = quantity;

                for (const source of productSources) {
                    const { orderId, quantity: sourceQuantity, expirationDate } = source;
                    const quantityToTake = Math.min(remainingQuantity, sourceQuantity);
                    remainingQuantity -= quantityToTake;

                    await ProductOrderProduct.create({
                        order_id: orderId,
                        product_id: productId,
                        quantity: quantityToTake,
                        expiration_date: expirationDate
                    }, { transaction });
                }

                await InvoiceLineItem.create({
                    invoice_id: invoice.invoice_id,
                    product_id: productId,
                    quantity: quantity
                }, { transaction });
            }

            await transaction.commit();
            return invoice;
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

    async getProductOrdersByProductId(productId, transaction) {
        const productOrders = await ProductOrderProduct.findAll({
            where: { product_id: productId },
            order: [['expiration_date', 'ASC']],
            transaction
        });
        return productOrders;
    }

    async getAllInvoices() {
        const invoices = await Invoice.findAll({
            include: [{ model: InvoiceLineItem, as: 'lineItems' }]
        });
        return invoices;
    }

    async getInvoiceById(invoiceId) {
        const invoice = await Invoice.findByPk(invoiceId, {
            include: [{ model: InvoiceLineItem, as: 'lineItems' }]
        });
        return invoice;
    }

    async updateInvoice(invoiceId, invoiceDate, selector, checker, driver, receivedBy) {
        const invoice = await Invoice.findByPk(invoiceId);
        if (!invoice) {
            throw new Error('Invoice not found');
        }
        invoice.invoice_date = invoiceDate;
        invoice.selector = selector;
        invoice.checker = checker;
        invoice.driver = driver;
        invoice.received_by = receivedBy;
        await invoice.save();
        return invoice;
    }

    async deleteInvoice(invoiceId) {
        const invoice = await Invoice.findByPk(invoiceId);
        if (!invoice) {
            throw new Error('Invoice not found');
        }
        await invoice.destroy();
    }
}

module.exports = InvoiceService;
