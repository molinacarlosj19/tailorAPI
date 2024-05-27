class ProductOrderProduct {
    constructor(productOrderProductId, orderId, productId, quantity, expirationDate) {
        this.productOrderProductId = productOrderProductId;
        this.orderId = orderId;
        this.productId = productId;
        this.quantity = quantity;
        this.expirationDate = expirationDate;
    }
}

module.exports = ProductOrderProduct;
