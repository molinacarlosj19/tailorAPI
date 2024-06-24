// services/ProductOrderService.js
const sequelize = require('../config/database');
const { DataTypes } = require('sequelize');

// Define models
const ProductOrder = sequelize.define('ProductOrder', {
    order_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    order_date: {
        type: DataTypes.DATE,
        allowNull: false
    },
    order_number: {
        type: DataTypes.STRING,
        allowNull: false
    },
    time_in: {
        type: DataTypes.TIME,
        allowNull: false
    },
    time_out: {
        type: DataTypes.TIME,
        allowNull: false
    }
}, {
    tableName: 'product_orders',
    timestamps: false
});

const ProductOrderProduct = sequelize.define('ProductOrderProduct', {
    product_order_product_id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    order_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: ProductOrder,
            key: 'order_id'
        }
    },
    product_id: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    quantity: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    expiration_date: {
        type: DataTypes.DATE,
        allowNull: false
    }
}, {
    tableName: 'product_order_products',
    timestamps: false
});

// Establish relationships
ProductOrder.hasMany(ProductOrderProduct, { foreignKey: 'order_id' });
ProductOrderProduct.belongsTo(ProductOrder, { foreignKey: 'order_id' });

class ProductOrderService {
    async createProductOrder(orderDate, orderNumber, timeIn, timeOut, productsData) {
        const result = await sequelize.transaction(async (t) => {
            const productOrder = await ProductOrder.create({
                order_date: orderDate,
                order_number: orderNumber,
                time_in: timeIn,
                time_out: timeOut
            }, { transaction: t });

            for (const productData of productsData) {
                await ProductOrderProduct.create({
                    order_id: productOrder.order_id,
                    product_id: productData.productId,
                    quantity: productData.quantity,
                    expiration_date: productData.expirationDate
                }, { transaction: t });
            }

            return productOrder;
        });

        return result;
    }

    async getProductOrderById(orderId) {
        const productOrder = await ProductOrder.findByPk(orderId, {
            include: ProductOrderProduct
        });
        if (!productOrder) {
            throw new Error('Order not found');
        }
        return productOrder;
    }

    async getAllProductOrders() {
        const productOrders = await ProductOrder.findAll({
            include: ProductOrderProduct
        });
        return productOrders;
    }

    async updateProductOrder(orderId, newData) {
        const result = await sequelize.transaction(async (t) => {
            const productOrder = await ProductOrder.findByPk(orderId, { transaction: t });
            if (!productOrder) {
                throw new Error('Order not found');
            }

            productOrder.order_date = newData.orderDate;
            productOrder.order_number = newData.orderNumber;
            productOrder.time_in = newData.timeIn;
            productOrder.time_out = newData.timeOut;
            await productOrder.save({ transaction: t });

            await ProductOrderProduct.destroy({ where: { order_id: orderId }, transaction: t });

            for (const productData of newData.products) {
                await ProductOrderProduct.create({
                    order_id: orderId,
                    product_id: productData.productId,
                    quantity: productData.quantity,
                    expiration_date: productData.expirationDate
                }, { transaction: t });
            }

            return productOrder;
        });

        return result;
    }

    async deleteProductOrder(orderId) {
        await sequelize.transaction(async (t) => {
            await ProductOrderProduct.destroy({ where: { order_id: orderId }, transaction: t });
            await ProductOrder.destroy({ where: { order_id: orderId }, transaction: t });
        });
    }
}

module.exports = ProductOrderService;
