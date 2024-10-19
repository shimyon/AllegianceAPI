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
            ref: 'NextOn',
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
            ref: 'OtherContact'
        }],
        is_active: {
            type: Boolean,
            default: true
        },
        is_customer: {
            type: Boolean,
            default: false
        },
        Customer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Customers'
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
        LastOpen: {
            type: Date
        },
        addedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    },
    {
        timestamps: true,
    });

module.exports = {
    ProspectsModal: (conn) => conn.model('Prospect', prospectSchema),
}
