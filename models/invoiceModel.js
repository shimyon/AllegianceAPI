const mongoose = require('mongoose')

const invoiceSchema = mongoose.Schema(
    {
        InvoiceNo: {
            type: Number
        },
        Customer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Customers'
        },
        Order: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Orders'
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
        InvoiceDate: {
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
        TermsAndCondition: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'InvoiceTermsandCondition'
        }],
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
        }
    },
    {
        timestamps: true,
    })

const invoiceTermsandCondition = mongoose.Schema(
    {
        InvoiceId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Invoices'
        },
        condition: {
            type: String
        }
    },
    {
        timestamps: true,
    }
)

const InvoiceModal = mongoose.model('Invoices', invoiceSchema);
const InvoiceProductModal = mongoose.model('InvoiceProduct', invoiceProductSchema);
const InvoiceTermsandCondition = mongoose.model('InvoiceTermsandCondition', invoiceTermsandCondition);

const syncIndex = async () => {
    await InvoiceModal.syncIndexes();
    await InvoiceProductModal.syncIndexes();
    await InvoiceTermsandCondition.syncIndexes();
}
syncIndex();

module.exports = { InvoiceModal, InvoiceProductModal, InvoiceTermsandCondition };