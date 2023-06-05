const mongoose = require('mongoose')

const prospectSchema = mongoose.Schema(
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
        Industry: {
            type: String
        },
        Segment: {
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
        Product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Products'
        },
        Executive: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        ProspectAmount: {
            type: Number
        },
        OrderTarget: {
            type: String
        },
        Notes: {
            type: String
        },
        Interaction: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'ProInteraction',
            default: null
        },
        NextTalk: {
            //this will use for appointment
            type: mongoose.Schema.Types.ObjectId,
            ref: 'ProNextOn',
            default: null
        },
        Requirements: {
            type: String
        },
        Tags: {
            type: String
        },
        Status: {
            type: String
        },
        Stage: {
            type: String
        },
        Source: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Sources'
        },
        StageDate: {
            type: Date
        },
        ProspectStage: {
            //this will use for prospect stages
            type: String
        },
        OtherContact: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'ProspectOtherContact'
        }],
        is_active: {
            type: Boolean,
            default: true
        },
        RemoveReason: {
            type: String
        },
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
    });

const proNextOnSchema = mongoose.Schema(
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

const proInteractionSchema = mongoose.Schema(
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

const prospectOtherContact = mongoose.Schema(
    {
        ProspectId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Prospect'
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

const ProspectsModal = mongoose.model('Prospect', prospectSchema);
const ProInteractionModal = mongoose.model('ProInteraction', proInteractionSchema);
const ProNextOnModal = mongoose.model('ProNextOn', proNextOnSchema);
const ProspectOtherContactModal = mongoose.model('ProspectOtherContact', prospectOtherContact);

const syncIndex = async () => {
    await ProspectsModal.syncIndexes();
    await ProNextOnModal.syncIndexes();
    await ProInteractionModal.syncIndexes();
    await ProspectOtherContactModal.syncIndexes();
}
syncIndex();

module.exports = { ProspectsModal, ProInteractionModal, ProNextOnModal, ProspectOtherContactModal };