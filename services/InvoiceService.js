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

            const insertInvoiceQuery = `
                INSERT INTO invoices (invoice_date, selector, checker, driver, received_by)
                VALUES ($1, $2, $3, $4, $5)
                RETURNING invoice_id
            `;
            const insertInvoiceValues = [invoiceDate, selector, checker, driver, receivedBy];
            const { rows: [invoice] } = await client.query(insertInvoiceQuery, insertInvoiceValues);
            const invoiceId = invoice.invoice_id;

            for (const product of products) {
                let remainingQuantity = product.quantity;
                const productSources = [];

                const productOrders = await this.getProductOrdersByProductId(client, product.productId);
                for (const productOrder of productOrders) {
                    if (remainingQuantity <= 0) break;
                    const quantityToTake = Math.min(remainingQuantity, productOrder.quantity);
                    remainingQuantity -= quantityToTake;

                    const insertProductSourceQuery = `
                        INSERT INTO invoice_product_sources (invoice_id, product_order_id, product_id, quantity, expiration_date)
                        VALUES ($1, $2, $3, $4, $5)
                    `;
                    const insertProductSourceValues = [invoiceId, productOrder.order_id, product.productId, quantityToTake, productOrder.expiration_date];
                    await client.query(insertProductSourceQuery, insertProductSourceValues);

                    productSources.push({
                        productOrderId: productOrder.order_id,
                        quantity: quantityToTake,
                        expirationDate: productOrder.expiration_date
                    });
                }

                const invoiceLineItem = new InvoiceLineItem(invoiceId, product.productId, product.quantity, productSources);

                // Save the invoice line item
                await this.saveInvoiceLineItem(client, invoiceLineItem);
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

    async getProductOrdersByProductId(client, productId) {
        const query = `
            SELECT po.order_id, pop.quantity, pop.expiration_date
            FROM product_orders po
            JOIN product_order_products pop ON po.order_id = pop.order_id
            WHERE pop.product_id = $1
            ORDER BY pop.expiration_date ASC
        `;
        const { rows } = await client.query(query, [productId]);
        return rows;
    }

    async saveInvoiceLineItem(client, invoiceLineItem) {
        const query = `
            INSERT INTO invoice_line_items (invoice_id, product_id, quantity)
            VALUES ($1, $2, $3)
        `;
        const values = [
            invoiceLineItem.invoiceId,
            invoiceLineItem.productId,
            invoiceLineItem.quantity
        ];
        await client.query(query, values);
    }

    async getAllInvoices() {
        const query = 'SELECT * FROM invoices';
        const { rows } = await this.pool.query(query);
        return rows;
    }

    async getInvoiceById(invoiceId) {
        const query = 'SELECT * FROM invoices WHERE invoice_id = $1';
        const { rows } = await this.pool.query(query, [invoiceId]);
        return rows[0];
    }

    async updateInvoice(invoiceId, invoiceDate, selector, checker, driver, receivedBy) {
        const query = `
            UPDATE invoices
            SET invoice_date = $1, selector = $2, checker = $3, driver = $4, received_by = $5
            WHERE invoice_id = $6
            RETURNING *
        `;
        const values = [invoiceDate, selector, checker, driver, receivedBy, invoiceId];
        const { rows } = await this.pool.query(query, values);
        return rows[0];
    }

    async deleteInvoice(invoiceId) {
        const client = await this.pool.connect();
        try {
            await client.query('BEGIN');

            const deleteInvoiceLineItemsQuery = 'DELETE FROM invoice_line_items WHERE invoice_id = $1';
            await client.query(deleteInvoiceLineItemsQuery, [invoiceId]);

            const deleteInvoiceProductSourcesQuery = 'DELETE FROM invoice_product_sources WHERE invoice_id = $1';
            await client.query(deleteInvoiceProductSourcesQuery, [invoiceId]);

            const deleteInvoiceQuery = 'DELETE FROM invoices WHERE invoice_id = $1';
            await client.query(deleteInvoiceQuery, [invoiceId]);

            await client.query('COMMIT');
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
        }
    }
}

module.exports = InvoiceService;
