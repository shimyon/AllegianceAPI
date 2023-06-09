const mongoose = require('mongoose')

const contractSchema = mongoose.Schema(
    {
        Customer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Customers'
        },
        Name:{
            type: String
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


const contractProcessSchema = mongoose.Schema({
    contractId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Contracts'
    },
    Name:{
        type: String
    },
    executive: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    subProcess: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ContractSubProcess'
    }],
    status:{
        type:String
    },
    progress:{
        type:Number
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

const contractSubProcessSchema = mongoose.Schema({
    processId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ContractProcess'
    },
    Name:{
        type: String
    },
    executive: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    dailyStatus: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ProcessDailyStatus'
    }],
    status:{
        type:String
    },
    progress:{
        type:Number
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

const processDailyStatusSchema = mongoose.Schema({
    subProcessId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ContractSubProcess'
    },
    status:{
        type:String
    },
    note:{
        type:String
    },
    progress:{
        type:Number
    },
    addedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    statusDate:{
        type: Date
    }
},{
    timestamps: true,
})

const ContractModal = mongoose.model('Contracts', contractSchema);
const ContractProcess = mongoose.model('ContractProcess', contractProcessSchema);
const ContractSubProcess = mongoose.model('ContractSubProcess', contractSubProcessSchema);
const ProcessDailyStatus = mongoose.model('ProcessDailyStatus', processDailyStatusSchema);

const syncIndex = async () => {
    await ContractModal.syncIndexes();
    await ContractProcess.syncIndexes();
    await ProcessDailyStatus.syncIndexes();
    await ContractSubProcess.syncIndexes();
}
syncIndex();

module.exports = { ContractModal, ContractProcess, ProcessDailyStatus ,ContractSubProcess};