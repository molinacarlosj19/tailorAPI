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

    // Other methods...
}

module.exports = InvoiceController;
