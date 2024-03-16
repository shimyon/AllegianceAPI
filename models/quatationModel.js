const mongoose = require('mongoose')

const quatationSchema = mongoose.Schema(
    {
        QuatationNo: {
            type: Number,
            unique: true,
        },
        QuatationCode: {
            type: String,
            unique: true,
        },
        QuatationName: {
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
        QuatationDate: {
            type: Date
        },
        ValidDate: {
            type: Date
        },
        OtherChargeName: {
            type: String
        },
        OtherCharge: {
            type: Number
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
        TermsAndCondition: {
            type: String
        },
        Note:
        {
            type: String
        }

    },
    {
        timestamps: true,
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

const QuatationModal = mongoose.model('Quatations', quatationSchema);
const QuatationProductModal = mongoose.model('QuatationProduct', quatationProductSchema);

const syncIndex = async () => {
    await QuatationModal.syncIndexes();
    await QuatationProductModal.syncIndexes();
}
syncIndex();

module.exports = { QuatationModal, QuatationProductModal };