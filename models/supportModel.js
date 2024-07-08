const mongoose = require('mongoose')

const supportSchema = mongoose.Schema(
    {
        Customer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Customers'
        },
        TicketCode: {
            type: String,
        },
        TicketNo:
        {
            type:Number,
            // unique: true,
        },
        Qty:
        {
            type:Number
        },
        Price:
        {
            type:Number
        },
        TicketDate:
        {
            type:Date
        },
        DueDate:
        {
            type:Date
        },
        Note:
        {
            type:String
        },
        AdditionalNote:
        {
            type:String
        },
        Status: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Status'
          },
        ReasonForCancel:
        {
            type:String
        },
        DeliveryDetail:
        {
            type:String
        },
        DelayReason:
        {
            type:String
        },
        Sales: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        is_active:
        {
            type:Boolean,
            default:true
        },
        Products: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Products'
        },
        addedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        NextTalk: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'SupportnextOn',
            default: null
        },
    },
    {
        timestamps: true,
    });
    const nextOnSchema = mongoose.Schema(
        {
            supportId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Support'
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

const SupportModal = mongoose.model('Support', supportSchema);
const SupportNextOnModal = mongoose.model('SupportnextOn', nextOnSchema);


const syncIndex = async () => {
    await SupportModal.syncIndexes();
    await SupportNextOnModal.syncIndexes();
}
syncIndex();

module.exports = { SupportModal, SupportNextOnModal };