const mongoose = require('mongoose')

const orderSchema = mongoose.Schema(
    {
        Customer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Customers'
        },
        Products: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'OrderProduct'
        }],
        ShippingAddress: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'ShippingAddress'
        },
        BillingAddress: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'BillingAddress'
        },
        Status: {
            type: String
        },
        TotalPrice: {
            type: Number
        },
        Tax: {
            type: Number
        },
        OrderDate: {
            type: Date
        },
        DeliveryDate: {
            type: Date
        },
        Executive: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        addedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        Note: {
            type: String
        },
        is_deleted: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true,
    })
const orderProductSchema = mongoose.Schema(
    {
        OrderId:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Orders'
        },
        Product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Products'
        },        
        Quantity: {
            type: String
        },
        Price: {
            type: String
        },
        Note: {
            type: String
        }

    })

const OrderModal = mongoose.model('Orders', orderSchema);
const OrderProductModal = mongoose.model('OrderProduct', orderProductSchema);

const syncIndex = async () => {
    await OrderModal.syncIndexes();
    await OrderProductModal.syncIndexes();
}
syncIndex();

module.exports = { OrderModal, OrderProductModal };