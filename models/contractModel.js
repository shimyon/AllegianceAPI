const mongoose = require('mongoose')

const contractSchema = mongoose.Schema(
    {
        Customer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Customers'
        },
        Name: {
            type: String
        },
        Process: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'ContractProcess'
        }],
        executive: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        ContractNo: {
            type: Number
        },
        StartDate: {
            type: Date
        },
        progress: {
            type: Number,
            default: 0
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
    Name: {
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
    progress: {
        type: Number,
        default: 0
    },
    note: {
        type: String
    },
    startDate: {
        type: Date
    },
    dueDate: {
        type: Date
    },
    addedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true,
})

const contractSubProcessSchema = mongoose.Schema({
    processId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ContractProcess'
    },
    Name: {
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
    progress: {
        type: Number,
        default: 0
    },
    note: {
        type: String
    },
    startDate: {
        type: Date
    },
    dueDate: {
        type: Date
    },
    addedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
}, {
    timestamps: true,
})

const processDailyStatusSchema = mongoose.Schema({
    subProcessId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ContractSubProcess'
    },
    note: {
        type: String
    },
    progress: {
        type: Number,
        default: 0
    },
    addedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    Date: {
        type: Date
    },
}, {
    timestamps: true,
})

// const ContractModal = mongoose.model('Contracts', contractSchema);
// const ContractProcess = mongoose.model('ContractProcess', contractProcessSchema);
// const ContractSubProcess = mongoose.model('ContractSubProcess', contractSubProcessSchema);
// const ProcessDailyStatus = mongoose.model('ProcessDailyStatus', processDailyStatusSchema);

// const syncIndex = async () => {
//     await ContractModal.syncIndexes();
//     await ContractProcess.syncIndexes();
//     await ProcessDailyStatus.syncIndexes();
//     await ContractSubProcess.syncIndexes();
// }
// syncIndex();

// module.exports = { ContractModal, ContractProcess, ProcessDailyStatus, ContractSubProcess };
module.exports = {
    ContractModal: (conn) => conn.model('Contracts', contractSchema),
    ContractProcess: (conn) => conn.model('ContractProcess', contractProcessSchema),
    ContractSubProcess: (conn) => conn.model('ContractSubProcess', contractSubProcessSchema),
    ProcessDailyStatus: (conn) => conn.model('ProcessDailyStatus', processDailyStatusSchema)
}