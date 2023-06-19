const mongoose = require('mongoose')

const supportSchema = mongoose.Schema(
    {
        Customer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Customers'
        },
        TicketNo:
        {
            type:Number
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
        Status:
        {
            type:String
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
        Executive: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        Products: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Products'
        },
        addedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    },
    {
        timestamps: true,
    })

const SupportModal = mongoose.model('Support', supportSchema);
const syncIndex = async () => {
    await SupportModal.syncIndexes();
}
syncIndex();

module.exports = { SupportModal };