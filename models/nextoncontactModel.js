const mongoose = require('mongoose')
//mongoose.set('strictQuery', false)

const nextOnSchema = mongoose.Schema(
    {
        leadId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Leads'
        },
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

const OtherContactSchema = mongoose.Schema(
    {
        LeadId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Leads'
        },
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
    NextOnModal: (conn) => conn.model('NextOn', nextOnSchema),
    OtherContact: (conn) => conn.model('OtherContact', OtherContactSchema),
};