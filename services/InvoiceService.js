const pool = require('../config/database');
const Invoice = require('../entities/Invoice');
const InvoiceLineItem = require('../entities/InvoiceLineItem');
const ProductService = require('./ProductService');

class InvoiceService {
    constructor() {
        this.pool = pool;
        this.productService = new ProductService();
    }

    async createInvoice(invoiceDate, selector, checker, driver, receivedBy, products) {
        const client = await this.pool.connect();
        try {
            await client.query('BEGIN');

            const insertInvoiceQuery = 'INSERT INTO invoices (invoice_date, selector, checker, driver, received_by) VALUES ($1, $2, $3, $4, $5) RETURNING invoice_id';
            const insertInvoiceValues = [invoiceDate, selector, checker, driver, receivedBy];
            const { rows: [invoice] } = await client.query(insertInvoiceQuery, insertInvoiceValues);
            const invoiceId = invoice.invoice_id;

            for (const product of products) {
                let remainingQuantity = product.quantity;
                const productSources = [];

                const productOrders = await this.getProductOrdersByProductId(product.productCode);
                for (const productOrder of productOrders) {
                    if (remainingQuantity <= 0) break;
                    const quantityToTake = Math.min(remainingQuantity, productOrder.quantity);
                    remainingQuantity -= quantityToTake;

                    const insertProductSourceQuery = 'INSERT INTO invoice_product_sources (invoice_id, product_order_id, product_id, quantity, expiration_date) VALUES ($1, $2, $3, $4, $5)';
                    const insertProductSourceValues = [invoiceId, productOrder.order_id, product.productCode, quantityToTake, productOrder.expiration_date];
                    await client.query(insertProductSourceQuery, insertProductSourceValues);

                    productSources.push({
                        productOrderId: productOrder.order_id,
                        quantity: quantityToTake,
                        expirationDate: productOrder.expiration_date
                    });
                }

                const invoiceLineItem = new InvoiceLineItem(invoiceId, product.productCode, product.quantity, productSources);

                // Save the invoice line item
                await this.saveInvoiceLineItem(invoiceLineItem);
            }

            await client.query('COMMIT');
            return new Invoice(invoiceId, invoiceDate, selector, checker, driver, receivedBy);
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }

    async getProductOrdersByProductId(productId) {
        const query = `
            SELECT po.order_id, pop.quantity, pop.expiration_date
            FROM product_orders po
            JOIN product_order_products pop ON po.order_id = pop.order_id
            WHERE pop.product_id = $1
            ORDER BY pop.expiration_date ASC
        `;
        const { rows } = await this.pool.query(query, [productId]);
        return rows;
    }

    async saveInvoiceLineItem(invoiceLineItem) {
        const query = `
            INSERT INTO invoice_line_items (invoice_id, product_id, quantity)
            VALUES ($1, $2, $3)
        `;
        const values = [
            invoiceLineItem.invoiceId,
            invoiceLineItem.productId,
            invoiceLineItem.quantity
        ];
        await this.pool.query(query, values);
    }

    // Other methods...
}

module.exports = InvoiceService;
