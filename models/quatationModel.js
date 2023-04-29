const mongoose = require('mongoose')

const quatationSchema = mongoose.Schema(
    {
        Customer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Customers'
        },
        Products: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'QuatationProduct'
        }],
        ShippingAddress: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'ShippingAddress'
        },
        BillingAddress: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'BillingAddress'
        },
        SalesExecutive: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        addedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
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
        QuatationDate: {
            type: Date
        },
        ValidDate: {
            type: Date
        },
        Status: {
            type: String
        },
        Note:
        {
            type:String
        }

    })

const quatationProductSchema = mongoose.Schema(
    {
        QuatationId: {
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
        }
    })

const QuatationModal = mongoose.model('Quatations', quatationSchema);
const QuatationProductModal = mongoose.model('QuatationProduct', quatationProductSchema);

const syncIndex = async () => {
    await QuatationModal.syncIndexes();
    await QuatationProductModal.syncIndexes();
}
syncIndex();

module.exports = { QuatationModal, QuatationProductModal };