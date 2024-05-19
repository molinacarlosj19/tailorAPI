const ProductService = require('../services/ProductService');

class ProductController {
    constructor() {
        this.productService = new ProductService();
    }

    async createProduct(req, res, next) {
        try {
            const { productCode, productName, expirationDate } = req.body;
            const newProduct = await this.productService.createProduct(productCode, productName, expirationDate);
            res.status(201).json(newProduct);
        } catch (error) {
            next(error);
        }
    }

    async getAllProducts(req, res, next) {
        try {
            const products = await this.productService.getAllProducts();
            res.json(products);
        } catch (error) {
            next(error);
        }
    }

    async getProductById(req, res, next) {
        try {
            const { id } = req.params;
            const product = await this.productService.getProductById(id);
            res.json(product);
        } catch (error) {
            next(error);
        }
    }

    async updateProduct(req, res, next) {
        try {
            const { id } = req.params;
            const newData = req.body;
            const updatedProduct = await this.productService.updateProduct(id, newData);
            res.json(updatedProduct);
        } catch (error) {
            next(error);
        }
    }

    async deleteProduct(req, res, next) {
        try {
            const { id } = req.params;
            await this.productService.deleteProduct(id);
            res.status(204).send();
        } catch (error) {
            next(error);
        }
    }
}

module.exports = ProductController;
