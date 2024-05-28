const InvoiceLineItemService = require('../services/InvoiceLineItemService');

class InvoiceLineItemController {
    constructor() {
        this.invoiceLineItemService = new InvoiceLineItemService();
    }

    async createInvoiceLineItem(req, res) {
        try {
            const { invoiceId, productId, quantity, sources } = req.body;
            const lineItem = await this.invoiceLineItemService.createInvoiceLineItem(invoiceId, productId, quantity, sources);
            res.status(201).json(lineItem);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async getInvoiceLineItemById(req, res) {
        try {
            const invoiceLineItemId = parseInt(req.params.id, 10);
            const lineItem = await this.invoiceLineItemService.getInvoiceLineItemById(invoiceLineItemId);
            res.status(200).json(lineItem);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async getAllInvoiceLineItems(req, res) {
        try {
            const lineItems = await this.invoiceLineItemService.getAllInvoiceLineItems();
            res.status(200).json(lineItems);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async updateInvoiceLineItem(req, res) {
        try {
            const invoiceLineItemId = parseInt(req.params.id, 10);
            const newData = req.body;
            const updatedLineItem = await this.invoiceLineItemService.updateInvoiceLineItem(invoiceLineItemId, newData);
            res.status(200).json(updatedLineItem);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async deleteInvoiceLineItem(req, res) {
        try {
            const invoiceLineItemId = parseInt(req.params.id, 10);
            await this.invoiceLineItemService.deleteInvoiceLineItem(invoiceLineItemId);
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

module.exports = InvoiceLineItemController;
