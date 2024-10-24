const mongoose = require('mongoose')

const invoiceSchema = mongoose.Schema(
    {
        InvoiceNo: {
            type: Number,
            unique: true,
        },
        InvoiceCode: {
            type: String,
        },
        InvoiceName: {
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
            ref: 'InvoiceProduct'
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
        RoundOff: {
            type: Number
        },
        Amount: {
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
        InvoiceDate: {
            type: Date
        },
        OrderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Orders'
        },
        QuatationId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Quatations'
        },
        TermsofDelivery: {
            type: String
        },
        PaymentofMode: {
            type: String
        },
        Deliverynote: {
            type: String
        },
        Dispatchdocno: {
            type: String
        },
        deliverydate: {
            type: Date
        },
        Dispatchthr: {
            type: String
        },
        Destination: {
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
const invoiceProductSchema = mongoose.Schema(
    {
        InvoiceId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Invoices'
        },
        Product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Products'
        },
        Quantity: {
            type: Number
        },
        Unit: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Units'
        },
        Price: {
            type: Number
        },
        CGST: {
            type: Number
        },
        SGST: {
            type: Number
        },
        TotalAmount: {
            type: Number
        },
        FinalAmount: {
            type: Number
        },
        Note: {
            type: String
        }
    },
    {
        timestamps: true,
    })

// const InvoiceModal = mongoose.model('Invoices', invoiceSchema);
// const InvoiceProductModal = mongoose.model('InvoiceProduct', invoiceProductSchema);

// const syncIndex = async () => {
//     await InvoiceModal.syncIndexes();
//     await InvoiceProductModal.syncIndexes();
// }
// syncIndex();

// module.exports = { InvoiceModal, InvoiceProductModal };
module.exports = {
    InvoiceModal: (conn) => conn.model('Invoices', invoiceSchema),
    InvoiceProductModal: (conn) => conn.model('InvoiceProduct', invoiceProductSchema),
}