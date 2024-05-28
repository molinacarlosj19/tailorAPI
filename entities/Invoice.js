class Invoice {
    constructor(invoiceId, invoiceDate, selector, checker, driver, receivedBy) {
        this.invoiceId = invoiceId;
        this.invoiceDate = invoiceDate;
        this.selector = selector;
        this.checker = checker;
        this.driver = driver;
        this.receivedBy = receivedBy;
    }
}

module.exports = Invoice;
