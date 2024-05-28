const pool = require('../config/database');
const InvoiceLineItem = require('../entities/InvoiceLineItem');

class InvoiceLineItemService {
    constructor() {
        this.pool = pool;
    }

    async createInvoiceLineItem(invoiceId, productId, quantity, sources) {
        const client = await this.pool.connect();
        try {
            const insertQuery = `
                INSERT INTO invoice_line_items (invoice_id, product_id, quantity)
                VALUES ($1, $2, $3) RETURNING invoice_line_item_id
            `;
            const values = [invoiceId, productId, quantity];
            const { rows: [lineItem] } = await client.query(insertQuery, values);

            for (const source of sources) {
                const insertSourceQuery = `
                    INSERT INTO invoice_product_sources (invoice_line_item_id, product_order_id, product_id, quantity, expiration_date)
                    VALUES ($1, $2, $3, $4, $5)
                `;
                const sourceValues = [lineItem.invoice_line_item_id, source.productOrderId, productId, source.quantity, source.expirationDate];
                await client.query(insertSourceQuery, sourceValues);
            }

            return new InvoiceLineItem(lineItem.invoice_line_item_id, invoiceId, productId, quantity, sources);
        } finally {
            client.release();
        }
    }

    async getInvoiceLineItemById(invoiceLineItemId) {
        const client = await this.pool.connect();
        try {
            const lineItemQuery = 'SELECT * FROM invoice_line_items WHERE invoice_line_item_id = $1';
            const { rows: [lineItem] } = await client.query(lineItemQuery, [invoiceLineItemId]);

            if (!lineItem) {
                throw new Error('Invoice Line Item not found');
            }

            const sourcesQuery = 'SELECT * FROM invoice_product_sources WHERE invoice_line_item_id = $1';
            const { rows: sources } = await client.query(sourcesQuery, [invoiceLineItemId]);

            return new InvoiceLineItem(lineItem.invoice_line_item_id, lineItem.invoice_id, lineItem.product_id, lineItem.quantity, sources);
        } finally {
            client.release();
        }
    }

    async getAllInvoiceLineItems() {
        const client = await this.pool.connect();
        try {
            const lineItemsQuery = 'SELECT * FROM invoice_line_items';
            const { rows: lineItems } = await client.query(lineItemsQuery);

            const invoiceLineItems = [];
            for (const lineItem of lineItems) {
                const sourcesQuery = 'SELECT * FROM invoice_product_sources WHERE invoice_line_item_id = $1';
                const { rows: sources } = await client.query(sourcesQuery, [lineItem.invoice_line_item_id]);
                invoiceLineItems.push(new InvoiceLineItem(lineItem.invoice_line_item_id, lineItem.invoice_id, lineItem.product_id, lineItem.quantity, sources));
            }

            return invoiceLineItems;
        } finally {
            client.release();
        }
    }

    async updateInvoiceLineItem(invoiceLineItemId, newData) {
        const client = await this.pool.connect();
        try {
            const updateQuery = `
                UPDATE invoice_line_items
                SET product_id = $1, quantity = $2
                WHERE invoice_line_item_id = $3
            `;
            const values = [newData.productId, newData.quantity, invoiceLineItemId];
            await client.query(updateQuery, values);

            const deleteSourcesQuery = 'DELETE FROM invoice_product_sources WHERE invoice_line_item_id = $1';
            await client.query(deleteSourcesQuery, [invoiceLineItemId]);

            for (const source of newData.sources) {
                const insertSourceQuery = `
                    INSERT INTO invoice_product_sources (invoice_line_item_id, product_order_id, product_id, quantity, expiration_date)
                    VALUES ($1, $2, $3, $4, $5)
                `;
                const sourceValues = [invoiceLineItemId, source.productOrderId, newData.productId, source.quantity, source.expirationDate];
                await client.query(insertSourceQuery, sourceValues);
            }

            return await this.getInvoiceLineItemById(invoiceLineItemId);
        } finally {
            client.release();
        }
    }

    async deleteInvoiceLineItem(invoiceLineItemId) {
        const client = await this.pool.connect();
        try {
            const deleteSourcesQuery = 'DELETE FROM invoice_product_sources WHERE invoice_line_item_id = $1';
            await client.query(deleteSourcesQuery, [invoiceLineItemId]);

            const deleteQuery = 'DELETE FROM invoice_line_items WHERE invoice_line_item_id = $1';
            await client.query(deleteQuery, [invoiceLineItemId]);
        } finally {
            client.release();
        }
    }
}

module.exports = InvoiceLineItemService;
