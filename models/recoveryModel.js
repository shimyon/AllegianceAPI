const mongoose = require('mongoose')

const recoverySchema = mongoose.Schema(
    {
        Customer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Customers'
        },
        RecoveryNo:
        {
            type:Number
        },
        Amount:
        {
            type:Number
        },
        Reminder:
        {
            type:Date
        },
        NextFollowup:
        {
            type:Date
        },
        Note:
        {
            type:String
        },
        Status:
        {
            type:String
        },
        is_active:
        {
            type:Boolean,
            default:true
        },
        addedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    },
    {
        timestamps: true,
    })

const RecoveryModal = mongoose.model('Recovery', recoverySchema);
const syncIndex = async () => {
    await RecoveryModal.syncIndexes();
}
syncIndex();

module.exports = { RecoveryModal };