const InvoiceLineItemService = require('../services/InvoiceLineItemService');

class InvoiceLineItemController {
    constructor() {
        this.invoiceLineItemService = new InvoiceLineItemService();
    }

    async createInvoiceLineItem(req, res, next) {
        try {
            const { invoiceId, productId, quantity, sources } = req.body;
            const lineItem = await this.invoiceLineItemService.createInvoiceLineItem(invoiceId, productId, quantity, sources);
            res.status(201).json(lineItem);
        } catch (error) {
            next(error); // Pass the error to the next middleware
        }
    }

    async getInvoiceLineItemById(req, res, next) {
        try {
            const { id } = req.params;
            const lineItem = await this.invoiceLineItemService.getInvoiceLineItemById(id);
            res.status(200).json(lineItem);
        } catch (error) {
            next(error); // Pass the error to the next middleware
        }
    }

    async getAllInvoiceLineItems(req, res, next) {
        try {
            const lineItems = await this.invoiceLineItemService.getAllInvoiceLineItems();
            res.status(200).json(lineItems);
        } catch (error) {
            next(error); // Pass the error to the next middleware
        }
    }

    async updateInvoiceLineItem(req, res, next) {
        try {
            const { id } = req.params;
            const newData = req.body;
            const updatedLineItem = await this.invoiceLineItemService.updateInvoiceLineItem(id, newData);
            res.status(200).json(updatedLineItem);
        } catch (error) {
            next(error); // Pass the error to the next middleware
        }
    }

    async deleteInvoiceLineItem(req, res, next) {
        try {
            const { id } = req.params;
            await this.invoiceLineItemService.deleteInvoiceLineItem(id);
            res.status(204).send();
        } catch (error) {
            next(error); // Pass the error to the next middleware
        }
    }
}

module.exports = InvoiceLineItemController;
