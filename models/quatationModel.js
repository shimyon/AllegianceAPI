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
        Sales: {
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
        is_deleted:{
            type:Boolean,
            default:false
        },
        TermsAndCondition: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'QuatationTermsandCondition'
        }],
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

    const quatationTermsandCondition = mongoose.Schema(
        {
            QuatationId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Quatations'
            },
            condition: {
                type: String
            }
        },
        {
            timestamps: true,
        }
    )
const QuatationModal = mongoose.model('Quatations', quatationSchema);
const QuatationProductModal = mongoose.model('QuatationProduct', quatationProductSchema);
const QuatationTermsandCondition = mongoose.model('QuatationTermsandCondition', quatationTermsandCondition);

const syncIndex = async () => {
    await QuatationModal.syncIndexes();
    await QuatationProductModal.syncIndexes();
    await QuatationTermsandCondition.syncIndexes();
}
syncIndex();

module.exports = { QuatationModal, QuatationProductModal, QuatationTermsandCondition };