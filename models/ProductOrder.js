// entities/ProductOrder.js
class ProductOrder {
    constructor(orderDate, totalAmount, status, products = []) {
        this.orderDate = orderDate;
        this.totalAmount = totalAmount;
        this.status = status;
        this.products = products;
    }

    addProduct(product) {
        this.products.push(product);
    }
}

module.exports = ProductOrder;
