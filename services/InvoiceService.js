const sequelize = require('../config/database');
const Invoice = require('../entities/Invoice');
const InvoiceLineItem = require('../entities/InvoiceLineItem');
const ProductOrderProduct = require('../entities/ProductOrderProduct');
const ProductOrder = require('../entities/ProductOrder'); // Ensure ProductOrder is correctly imported
const InvoiceProductSource = require('../entities/InvoiceProductSource'); // Assuming this model is defined to track the sources of products in invoices

class InvoiceService {
    async createInvoice(invoiceDate, selector, checker, driver, receivedBy, lineItems) {
        const transaction = await sequelize.transaction();
        try {
            console.log("Received data:", { invoiceDate, selector, checker, driver, receivedBy, lineItems });

            // Create the Invoice entry
            const invoice = await Invoice.create({
                invoice_date: invoiceDate,
                selector: selector,
                checker: checker,
                driver: driver,
                received_by: receivedBy
            }, { transaction });

            // Ensure lineItems array is not empty before proceeding
            if (lineItems.length === 0) {
                throw new Error('No line items provided for the invoice');
            }

            // Iterate over each line item in the invoice
            for (const item of lineItems) {
                const { productId, quantity, orderNumber } = item;

                // Fetch product sources based on productId and orderNumber
                const productSources = await this.getProductOrdersByProductId(productId, transaction);

                if (!productSources || productSources.length === 0) {
                    throw new Error(`No product sources found for productId: ${productId} and orderNumber: ${orderNumber}`);
                }

                let remainingQuantity = quantity;

                // Create InvoiceLineItem entry
                const invoiceLineItem = await InvoiceLineItem.create({
                    invoice_id: invoice.invoice_id,
                    product_id: productId,
                    quantity: quantity
                }, { transaction });

                // Iterate over the product sources to create InvoiceProductSource entries
                for (const source of productSources) {
                    if (!source.ProductOrder || !source.ProductOrder.order_number) {
                        console.error('ProductOrder or order_number is missing for source:', source);
                        throw new Error('ProductOrder or order_number is missing');
                    }

                    if (source.ProductOrder.order_number !== orderNumber) continue;

                    const { order_id: orderId, quantity: sourceQuantity, expiration_date: expirationDate } = source;
                    const quantityToTake = Math.min(remainingQuantity, sourceQuantity);
                    remainingQuantity -= quantityToTake;

                    // Create the InvoiceProductSource entry
                    await InvoiceProductSource.create({
                        invoice_line_item_id: invoiceLineItem.invoice_line_item_id,
                        order_id: orderId,
                        product_id: productId,
                        quantity: quantityToTake,
                        expiration_date: expirationDate
                    }, { transaction });

                    // Deduct the quantity from the product order (tracking inventory)
                    await ProductOrderProduct.update(
                        { quantity: sourceQuantity - quantityToTake },
                        { where: { product_order_product_id: source.product_order_product_id }, transaction }
                    );

                    if (remainingQuantity <= 0) break;
                }
            }

            await transaction.commit();
            return invoice;
        } catch (error) {
            await transaction.rollback();
            console.error('Error creating invoice:', error);
            throw error;
        }
    }

    async getProductOrdersByProductId(productId, transaction) {
        return ProductOrderProduct.findAll({
            where: { product_id: productId },
            include: [{
                model: ProductOrder, // Ensure ProductOrder is defined and associated
                as: 'ProductOrder',
                attributes: ['order_number']
            }],
            order: [['expiration_date', 'ASC']],
            transaction
        });
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

    async updateInvoice(invoiceId, invoice_date, selector, checker, driver, received_by) {
        const invoice = await Invoice.findByPk(invoiceId);
        if (!invoice) {
            throw new Error('Invoice not found');
        }
        invoice.invoice_date = invoice_date;
        invoice.selector = selector;
        invoice.checker = checker;
        invoice.driver = driver;
        invoice.received_by = received_by;
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
