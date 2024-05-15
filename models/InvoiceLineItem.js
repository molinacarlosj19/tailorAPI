// entities/InvoiceLineItem.js
class InvoiceLineItem {
    constructor(invoiceId, productId, quantity, unitPrice, totalAmount) {
        this.invoiceId = invoiceId;
        this.productId = productId;
        this.quantity = quantity;
        this.unitPrice = unitPrice;
        this.totalAmount = totalAmount;
    }
}

module.exports = InvoiceLineItem;
