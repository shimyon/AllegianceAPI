const mongoose = require('mongoose')

const orderSchema = mongoose.Schema(
    {
        OrderNo: {
            type: Number
        },
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
        Amount: {
            type: Number
        },
        CGST: {
            type: Number
        },
        SGST: {
            type: Number
        },
        Discount: {
            type: Number
        },
        TotalTax: {
            type: Number
        },
        TotalPrice: {
            type: Number
        },
        OrderDate: {
            type: Date
        },
        DeliveryDate: {
            type: Date
        },
        Sales: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        Stage: {
            type: String
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
        },
        Invoice_Created: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true,
    })
const orderProductSchema = mongoose.Schema(
    {
        OrderId: {
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
        Unit: {
            type: String
        },
        Price: {
            type: String
        },
        Discount: {
            type: String
        },
        CGST: {
            type: String
        },
        SGST: {
            type: String
        },
        TotalAmount: {
            type: String
        },
        Note: {
            type: String
        },
        addedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        is_deleted: {
            type: Boolean,
            default: false
        }
    },
    {
        timestamps: true,
    })

const OrderModal = mongoose.model('Orders', orderSchema);
const OrderProductModal = mongoose.model('OrderProduct', orderProductSchema);

const syncIndex = async () => {
    await OrderModal.syncIndexes();
    await OrderProductModal.syncIndexes();
}
syncIndex();

module.exports = { OrderModal, OrderProductModal };