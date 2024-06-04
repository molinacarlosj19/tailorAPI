class InvoiceLineItem {
    constructor(invoiceLineItemId, invoiceId, productId, quantity, sources = []) {
        this.invoiceLineItemId = invoiceLineItemId;
        this.invoiceId = invoiceId;
        this.productId = productId;
        this.quantity = quantity;
        this.sources = sources;
    }
}

module.exports = InvoiceLineItem;