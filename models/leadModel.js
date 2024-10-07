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
        Address: {
            type: String
        },
        City: {
             type: mongoose.Schema.Types.ObjectId,
            ref: 'City'
        },
        State: {
             type: mongoose.Schema.Types.ObjectId,
            ref: 'States'
        },
        Country: {
             type: mongoose.Schema.Types.ObjectId,
            ref: 'Country'
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
        Icon: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Icon'
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
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Status'
          },
        Stage: {
            type: String
        },
        StageDate: {
            type: Date
        },
        is_active: {
            type: Boolean,
            default: true
        },
        RemoveReason: {
            type: String
        },
        CustomerRefrence: {
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
module.exports = {
    LeadsModal: (conn) => conn.model('Leads', leadSchema),
    NextOnModal: (conn) => conn.model('NextOn', nextOnSchema),
    LeadOtherContact: (conn) => conn.model('LeadOtherContact', leadOtherContact),
}