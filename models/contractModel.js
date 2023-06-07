const mongoose = require('mongoose')

const contractSchema = mongoose.Schema(
    {
        Customer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Customers'
        },
        ContractNo: {
            type: String
        },
        StartDate: {
            type: Date
        },
        ExpiryDate: {
            type: Date
        },
        Type: {
            type: String
        },
        Item: {
            type: String
        },
        Description: {
            type: String
        },
        ContractCharges: {
            type: Number
        },
        RenewalCharges: {
            type: Number
        },
        Files: [{
            type: String
        }],
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


const ContractModal = mongoose.model('Contracts', contractSchema);
const syncIndex = async () => {
    await ContractModal.syncIndexes();
}
syncIndex();

module.exports = { ContractModal};