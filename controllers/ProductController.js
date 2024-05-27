const ProductService = require('../services/ProductService');

class ProductController {
    constructor() {
        this.productService = new ProductService();
    }

    async createProduct(req, res, next) {
        try {
            const { productCode, productName } = req.body;
            const product = await this.productService.createProduct(productCode, productName);
            res.status(201).json(product);
        } catch (error) {
            next(error);
        }
    }

    async getAllProducts(req, res, next) {
        try {
            const products = await this.productService.getAllProducts();
            res.status(200).json(products);
        } catch (error) {
            next(error);
        }
    }

    async getProductById(req, res, next) {
        try {
            const productId = parseInt(req.params.id, 10);
            const product = await this.productService.getProductById(productId);
            res.status(200).json(product);
        } catch (error) {
            next(error);
        }
    }

    async updateProduct(req, res, next) {
        try {
            const productId = parseInt(req.params.id, 10);
            const newData = req.body;
            const updatedProduct = await this.productService.updateProduct(productId, newData);
            res.status(200).json(updatedProduct);
        } catch (error) {
            next(error);
        }
    }

    async deleteProduct(req, res, next) {
        try {
            const productId = parseInt(req.params.id, 10);
            await this.productService.deleteProduct(productId);
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    }
}

module.exports = ProductController;
