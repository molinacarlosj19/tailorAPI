// controllers/ProductController.js
const ProductService = require('../services/ProductService');

class ProductController {
    constructor() {
        this.productService = new ProductService();
    }

    async createProduct(req, res) {
        try {
            const { productName, unitPrice, expirationDate } = req.body;
            const product = await this.productService.createProduct(productName, unitPrice, expirationDate);
            res.status(201).json(product);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    async getAllProducts(req, res) {
        console.log("Loaded ProductController");
        try {
            const products = await this.productService.getAllProducts();
            console.log("Lenght Product " + products.length());
            console.log("Before res.json(products) ProductController");
            res.json(products);
        } catch (error) {
            console.log("Error getAllProducts ProductController");
            res.status(500).json({ message: error.message });
        }
    }

    async getProductById(req, res) {
        try {
            const productId = req.params.id;
            const product = await this.productService.getProductById(productId);
            res.json(product);
        } catch (error) {
            res.status(404).json({ message: error.message });
        }
    }

    async updateProduct(req, res) {
        try {
            const productId = req.params.id;
            const newData = req.body;
            const updatedProduct = await this.productService.updateProduct(productId, newData);
            res.json(updatedProduct);
        } catch (error) {
            res.status(404).json({ message: error.message });
        }
    }

    async deleteProduct(req, res) {
        try {
            const productId = req.params.id;
            await this.productService.deleteProduct(productId);
            res.status(204).send();
        } catch (error) {
            res.status(404).json({ message: error.message });
        }
    }
}

module.exports = ProductController;
