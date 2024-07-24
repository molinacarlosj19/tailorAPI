const express = require('express');
const InvoiceLineItemController = require('../controllers/InvoiceLineItemController');

const router = express.Router();
const invoiceLineItemController = new InvoiceLineItemController();

router.post('/', (req, res, next) => invoiceLineItemController.createInvoiceLineItem(req, res, next));
router.get('/', (req, res, next) => invoiceLineItemController.getAllInvoiceLineItems(req, res, next));
router.get('/:id', (req, res, next) => invoiceLineItemController.getInvoiceLineItemById(req, res, next));
router.put('/:id', (req, res, next) => invoiceLineItemController.updateInvoiceLineItem(req, res, next));
router.delete('/:id', (req, res, next) => invoiceLineItemController.deleteInvoiceLineItem(req, res, next));

module.exports = router;
