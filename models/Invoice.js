// entities/Invoice.js
class Invoice {
    constructor(productOrderId, invoiceDate, totalAmount) {
        this.productOrderId = productOrderId;
        this.invoiceDate = invoiceDate;
        this.totalAmount = totalAmount;
    }
}

module.exports = Invoice;
