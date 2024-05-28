const express = require('express');
const InvoiceLineItemController = require('../controllers/InvoiceLineItemController');

const router = express.Router();
const invoiceLineItemController = new InvoiceLineItemController();

router.post('/', (req, res) => invoiceLineItemController.createInvoiceLineItem(req, res));
router.get('/', (req, res) => invoiceLineItemController.getAllInvoiceLineItems(req, res));
router.get('/:id', (req, res) => invoiceLineItemController.getInvoiceLineItemById(req, res));
router.put('/:id', (req, res) => invoiceLineItemController.updateInvoiceLineItem(req, res));
router.delete('/:id', (req, res) => invoiceLineItemController.deleteInvoiceLineItem(req, res));

module.exports = router;
