class ProductOrder {
    constructor(orderId, orderDate, orderNumber, timeIn, timeOut) {
        this.orderId = orderId;
        this.orderDate = orderDate;
        this.orderNumber = orderNumber;
        this.timeIn = timeIn;
        this.timeOut = timeOut;
    }
}

module.exports = ProductOrder;
