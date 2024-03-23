const mongoose = require('mongoose')

const orderSchema = mongoose.Schema(
    {
        OrderNo: {
            type: Number,
            unique: true,
        },
        OrderCode: {
            type: String,
            unique: true,
        },
        OrderName: {
            type: String
        },
        Descriptionofwork: {
            type: String
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
        Sales: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        addedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
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
        BeforeTaxPrice: {
            type: Number
        },
        AfterTaxPrice: {
            type: Number
        },
        FinalPrice: {
            type: Number
        },
        OtherChargeName: {
            type: String
        },
        OtherCharge: {
            type: Number
        },
        Note: {
            type: String
        },
        TermsAndCondition: {
            type: String
        },
        DeliveryDate: {
            type: Date
        },
        Stage: {
            type: String
        },
        Status: {
            type: String
        },
        is_deleted: {
            type: Boolean,
            default: false
        },
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
        CGST: {
            type: String
        },
        SGST: {
            type: String
        },
        TotalAmount: {
            type: String
        },
        FinalAmount: {
            type: String
        },
        Note: {
            type: String
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