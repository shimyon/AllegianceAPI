const mongoose = require('mongoose')

const customerSchema = mongoose.Schema(
    {
        Company: {
            type: String,
            required: [true, 'Please add a company']
        },
        CustomerNo: {
            type: Number,
            unique: true,
        },
        CustomerCode: {
            type: String,
        },
        GSTNo: {
            type: String,
        },
        Title: {
            type: String,
        },
        FirstName: {
            type: String,
            required: [true, 'Please add First Name']
        },
        LastName: {
            type: String,
        },
        Designation: {
            type: String
        },
        Mobile: {
            type: Number,
        },
        Email: {
            type: String,
        },
        Address: {
            type: String
        },
        City: {
            type: mongoose.Schema.Types.ObjectId,
           ref: 'City'
       },
       State: {
            type: mongoose.Schema.Types.ObjectId,
           ref: 'States'
       },
       Country: {
            type: mongoose.Schema.Types.ObjectId,
           ref: 'Country'
       },
        Notes: {
            type: String
        },
        is_active: {
            type: Boolean,
            default: true
        },
        addedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        BillingAddress: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'BillingAddress'
        }],
        ShippingAddress: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'ShippingAddress'
        }]
    },
    {
        timestamps: true,
    }
)

const billingAddressSchema = mongoose.Schema(
    {
        Customer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Customer'
        },
        Address: {
            type: String
        },
        City: {
            type: mongoose.Schema.Types.ObjectId,
           ref: 'City'
       },
       State: {
            type: mongoose.Schema.Types.ObjectId,
           ref: 'States'
       },
       Country: {
            type: mongoose.Schema.Types.ObjectId,
           ref: 'Country'
       },
        is_active: {
            type: Boolean,
            default: true
        },
        is_default: {
            type: Boolean,
            default: false
        }
    })
const shippingAddressSchema = mongoose.Schema(
    {
        Customer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Customer'
        },
        Address: {
            type: String
        },
        City: {
            type: mongoose.Schema.Types.ObjectId,
           ref: 'City'
       },
       State: {
            type: mongoose.Schema.Types.ObjectId,
           ref: 'States'
       },
       Country: {
            type: mongoose.Schema.Types.ObjectId,
           ref: 'Country'
       },
        is_active: {
            type: Boolean,
            default: true
        },
        is_default: {
            type: Boolean,
            default: false
        }
    })

// const CustomerModal = mongoose.model('Customers', customerSchema);
// const BillingAddressModal = mongoose.model('BillingAddress', billingAddressSchema);
// const ShippingAddressModal = mongoose.model('ShippingAddress', shippingAddressSchema);

// const syncIndex = async () => {
//     await CustomerModal.syncIndexes();
//     await BillingAddressModal.syncIndexes();
//     await ShippingAddressModal.syncIndexes();
// }
// syncIndex();

// module.exports = { CustomerModal, BillingAddressModal, ShippingAddressModal };
module.exports = {
    CustomerModal: (conn) => conn.model('Customers', customerSchema),
    BillingAddressModal: (conn) => conn.model('BillingAddress', billingAddressSchema),
    ShippingAddressModal: (conn) => conn.model('ShippingAddress', shippingAddressSchema),

}