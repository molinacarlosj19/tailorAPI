// InvoiceController.js
const InvoiceService = require('../services/InvoiceService');

class InvoiceController {
    constructor() {
        this.invoiceService = new InvoiceService();
    }

    async createInvoice(req, res, next) {
        try {
            const { invoice_date, selector, checker, driver, received_by, lineItems } = req.body;
            const invoice = await this.invoiceService.createInvoice(invoice_date, selector, checker, driver, received_by, lineItems);
            res.status(201).json(invoice);
        } catch (error) {
            next(error);
        }
    }

    async getAllInvoices(req, res, next) {
        try {
            const invoices = await this.invoiceService.getAllInvoices();
            res.status(200).json(invoices);
        } catch (error) {
            next(error);
        }
    }

    async getInvoiceById(req, res, next) {
        try {
            const { id } = req.params;
            const invoice = await this.invoiceService.getInvoiceById(id);
            if (invoice) {
                res.status(200).json(invoice);
            } else {
                res.status(404).json({ message: 'Invoice not found' });
            }
        } catch (error) {
            next(error);
        }
    }

    async updateInvoice(req, res, next) {
        try {
            const { id } = req.params;
            const { invoice_date, selector, checker, driver, received_by } = req.body;
            const invoice = await this.invoiceService.updateInvoice(id, invoice_date, selector, checker, driver, received_by);
            if (invoice) {
                res.status(200).json(invoice);
            } else {
                res.status(404).json({ message: 'Invoice not found' });
            }
        } catch (error) {
            next(error);
        }
    }

    async deleteInvoice(req, res, next) {
        try {
            const { id } = req.params;
            await this.invoiceService.deleteInvoice(id);
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    }
}

module.exports = InvoiceController;
