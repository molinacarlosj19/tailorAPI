const express = require('express');
const InvoiceController = require('../controllers/InvoiceController');

const router = express.Router();
const invoiceController = new InvoiceController();

router.post('/', (req, res, next) => invoiceController.createInvoice(req, res, next));
router.get('/', (req, res, next) => invoiceController.getAllInvoices(req, res, next));
router.get('/:id', (req, res, next) => invoiceController.getInvoiceById(req, res, next));
router.put('/:id', (req, res, next) => invoiceController.updateInvoice(req, res, next));
router.delete('/:id', (req, res, next) => invoiceController.deleteInvoice(req, res, next));

module.exports = router;
