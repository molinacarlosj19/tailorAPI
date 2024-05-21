// entities/Invoice.js
class Invoice {
    constructor(invoiceDate, selector, checker, driver, receivedBy) {
        this.invoiceDate = invoiceDate;
        this.selector = selector;
        this.checker = checker;
        this.driver = driver;
        this.receivedBy = receivedBy;
    }
}

module.exports = Invoice;
