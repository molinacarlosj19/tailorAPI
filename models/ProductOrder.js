class ProductOrder {
    constructor(orderDate, orderNumber, timeIn, timeOut, products = []) {
        this.orderDate = orderDate;
        this.orderNumber = orderNumber;
        this.timeIn = timeIn;
        this.timeOut = timeOut;
        this.products = products;
    }

    addProduct(product) {
        this.products.push(product);
    }
}

module.exports = ProductOrder;
