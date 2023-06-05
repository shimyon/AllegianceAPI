const mongoose = require('mongoose')
//mongoose.set('strictQuery', false)

const leadSchema = mongoose.Schema(
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
        Executive: {
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
        Interaction: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Interaction',
            default: null
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
        proId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Prospects'
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
        }
    });

const interactionSchema = mongoose.Schema(
    {
        proId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Prospects'
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
        }
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
    });

const LeadsModal = mongoose.model('Leads', leadSchema);
const InteractionModal = mongoose.model('Interaction', interactionSchema);
const NextOnModal = mongoose.model('NextOn', nextOnSchema);
const LeadOtherContact = mongoose.model('LeadOtherContact', leadOtherContact);

const syncIndex = async () => {
    await LeadsModal.syncIndexes();
    await InteractionModal.syncIndexes();
    await NextOnModal.syncIndexes();
    await LeadOtherContact.syncIndexes();
}
syncIndex();

module.exports = { LeadsModal, InteractionModal, NextOnModal, LeadOtherContact };