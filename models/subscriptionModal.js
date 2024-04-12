const mongoose = require('mongoose')

const subscriptionSchema = mongoose.Schema(
    {
        Customer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Customers'
        },
        ContractNo: {
            type: Number
        },
        StartDate: {
            type: Date
        },
        ExpiryDate: {
            type: Date
        },
        Type: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Types'
        },
        Item: {
            type: String
        },
        ContractCharges: {
            type: Number
        },
        RenewalCharges: {
            type: Number
        },
        Description: {
            type: String
        },
        Files: {
            type: String
        },
        is_active: {
            type: Boolean,
            default: true
        },
        addedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    },
    {
        timestamps: true,
    });

module.exports = mongoose.model('Subscription', subscriptionSchema)