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
            unique: true
        },
        Email: {
            type: String,
            required: [true, 'Please add email'],
            unique: true
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
            type: String
        },
        Interaction: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Interaction'
        },
        NextTalk: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'NextOn'
        },
        Status: {
            type: String
        },
        Stage: {
            type: String
        },
        is_active: {
            type: Boolean,
            default: true
        },
        is_favorite: {
            type: Boolean,
            default: false
        },
    },
    {
        timestamps: true,
    }
)

const interactionSchema = mongoose.Schema(
    {
        date: {
            type: Date
        },
        note: {
            type: string
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    });

const nextOnSchema = mongoose.Schema(
    {
        date: {
            type: Date
        },
        note: {
            type: string
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    });

const LeadsModal = mongoose.model('Leads', leadSchema);
const InteractionModal = mongoose.model('Interaction', interactionSchema);
const NextOnModal = mongoose.model('NextOn', nextOnSchema);

const syncIndex = async () => {
    await LeadsModal.syncIndexes();
    await InteractionModal.syncIndexes();
    await NextOnModal.syncIndexes();
}
syncIndex();

module.exports = { LeadsModal,InteractionModal,NextOnModal };