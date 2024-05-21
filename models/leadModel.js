const mongoose = require('mongoose')
//mongoose.set('strictQuery', false)

const leadSchema = mongoose.Schema(
    {
        Company: {
            type: String,
            required: [true, 'Please add a company']
        },
        GSTNo: {
            type: String,
        },
        Title: {
            type: String,
        },
        FirstName: {
            type: String,
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
        City: {
            type: String
        },
        State: {
            type: String
        },
        Country: {
            type: String
        },
        Source: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Sources'
        },
        Product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Products'
        },
        Sales: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        Requirements: {
            type: String
        },
        Notes: {
            type: String
        },
        InCharge: {
            type: String
        },
        LeadSince: {
            //use for getting lead add date
            type: Date
        },
        NextTalk: {
            //this will use for appointment
            type: mongoose.Schema.Types.ObjectId,
            ref: 'NextOn',
            default: null
        },
        Status: {
            type: String
        },
        Stage: {
            type: String
        },
        StageDate: {
            type: Date
        },
        ProspectStage: {
            //this will use for prospect stages
            type: String
        },
        is_active: {
            type: Boolean,
            default: true
        },
        RemoveReason: {
            type: String
        },
        OtherContact: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'LeadOtherContact'
        }],
        is_favorite: {
            type: Boolean,
            default: false
        },
        addedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    },
    {
        timestamps: true,
    }
)

const nextOnSchema = mongoose.Schema(
    {
        leadId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Leads'
        },
        date: {
            type: Date
        },
        note: {
            type: String
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
    },
    {
        timestamps: true,
    });

const leadOtherContact = mongoose.Schema(
    {
        LeadId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Leads'
        },
        Name: {
            type: String
        },
        Mobile: {
            type: Number
        },
        Email: {
            type: String
        }
    },
    {
        timestamps: true,
    });

const LeadsModal = mongoose.model('Leads', leadSchema);
const NextOnModal = mongoose.model('NextOn', nextOnSchema);
const LeadOtherContact = mongoose.model('LeadOtherContact', leadOtherContact);

const syncIndex = async () => {
    await LeadsModal.syncIndexes();
    await NextOnModal.syncIndexes();
    await LeadOtherContact.syncIndexes();
}
syncIndex();

module.exports = { LeadsModal, NextOnModal, LeadOtherContact };