const mongoose = require('mongoose')

const customerSchema = mongoose.Schema(
    {
        Company: {
            type: String,
            required: [true, 'Please add a company']
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
            required: [true, 'Please add Last Name']
        },
        Designation: {
            type: String
        },
        Mobile: {
            type: Number,
            required: [true, 'Please add Mobile'],
        },
        Email: {
            type: String,
            required: [true, 'Please add email'],
        },
        Address: {
            type: String
        },
        City: {
            type: String
        },
        State: {
            type: String
        },
        Country: {
            type: String
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
            type: String
        },
        State: {
            type: String
        },
        Country: {
            type: String
        },
        is_active: {
            type: Boolean,
            default: true
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
            type: String
        },
        State: {
            type: String
        },
        Country: {
            type: String
        },
        is_active: {
            type: Boolean,
            default: true
        }
    })

const CustomerModal = mongoose.model('Customers', customerSchema);
const BillingAddressModal = mongoose.model('BillingAddress', billingAddressSchema);
const ShippingAddressModal = mongoose.model('ShippingAddress', shippingAddressSchema);

const syncIndex = async () => {
    await CustomerModal.syncIndexes();
    await BillingAddressModal.syncIndexes();
    await ShippingAddressModal.syncIndexes();
}
syncIndex();

module.exports = { CustomerModal, BillingAddressModal, ShippingAddressModal };