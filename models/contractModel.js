const mongoose = require('mongoose')

const contractSchema = mongoose.Schema(
    {
        Customer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Customers'
        },
        Process:[{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'ContractProcess'
        }],
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


const contractProcessSchema = mongoose.Schema({
    contractId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Contracts'
    },
    executive: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    status:{
        type:String
    },
    note:{
        type:String
    },
    startDate:{
        type: Date
    },
    dueDate:{
        type: Date
    },
    addedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
},{
    timestamps: true,
})
const ContractModal = mongoose.model('Contracts', contractSchema);
const ContractProcess = mongoose.model('ContractProcess', contractProcessSchema);
const syncIndex = async () => {
    await ContractModal.syncIndexes();
    await ContractProcess.syncIndexes();
}
syncIndex();

module.exports = { ContractModal, ContractProcess };