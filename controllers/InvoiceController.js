const InvoiceService = require('../services/InvoiceService');

class InvoiceController {
    constructor() {
        this.invoiceService = new InvoiceService();
    }

    async createInvoice(req, res) {
        try {
            const { invoiceDate, selector, checker, driver, receivedBy, products } = req.body;
            const invoice = await this.invoiceService.createInvoice(invoiceDate, selector, checker, driver, receivedBy, products);
            res.status(201).json(invoice);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async getAllInvoices(req, res) {
        try {
            const invoices = await this.invoiceService.getAllInvoices();
            res.status(200).json(invoices);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async getInvoiceById(req, res) {
        try {
            const { id } = req.params;
            const invoice = await this.invoiceService.getInvoiceById(id);
            if (invoice) {
                res.status(200).json(invoice);
            } else {
                res.status(404).json({ message: 'Invoice not found' });
            }
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async updateInvoice(req, res) {
        try {
            const { id } = req.params;
            const { invoiceDate, selector, checker, driver, receivedBy } = req.body;
            const invoice = await this.invoiceService.updateInvoice(id, invoiceDate, selector, checker, driver, receivedBy);
            if (invoice) {
                res.status(200).json(invoice);
            } else {
                res.status(404).json({ message: 'Invoice not found' });
            }
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async deleteInvoice(req, res) {
        try {
            const { id } = req.params;
            await this.invoiceService.deleteInvoice(id);
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
}

module.exports = InvoiceController;
