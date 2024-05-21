const express = require('express');
const InvoiceController = require('../controllers/InvoiceController');

const router = express.Router();
const invoiceController = new InvoiceController();

router.post('/invoices', (req, res) => invoiceController.createInvoice(req, res));

module.exports = router;
