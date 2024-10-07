const mongoose = require('mongoose')

const prospectSchema = mongoose.Schema(
    {
        Company: {
            type: String,
            required: [true, 'Please add a company']
        },
        GSTNo: {
            type: String,
        },
        CompanyCode: {
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
        Address: {
            type: String
        },
        Industry: {
            type: String
        },
        Segment: {
            type: String
        },
        Mobile: {
            type: Number,
        },
        Email: {
            type: String,
        },
        Website: {
            type: String,
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
        Product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Products'
        },
        Sales: {
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
        Stage: {
           type: mongoose.Schema.Types.ObjectId,
            ref: 'Status'
        },
        Source: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Sources'
        },
        StageDate: {
            type: Date
        },
        OtherContact: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'ProspectOtherContact'
        }],
        is_active: {
            type: Boolean,
            default: true
        },
        is_customer: {
            type: Boolean,
            default: false
        },
        is_readed: {
            type: Boolean,
            default: false
        },
        RemoveReason: {
            type: String
        },
        CustomerRefrence: {
            type: String
        },
        LastOpen: {
            type: Date
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
        prospectId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Prospect'
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
    },
    {
        timestamps: true,
    });

module.exports = {
    ProspectsModal: (conn) => conn.model('Prospect', prospectSchema),
    ProNextOnModal: (conn) => conn.model('ProNextOn', proNextOnSchema),
    ProspectOtherContactModal: (conn) => conn.model('ProspectOtherContact', prospectOtherContact),
}