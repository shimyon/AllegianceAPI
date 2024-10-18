const mongoose = require('mongoose')
//mongoose.set('strictQuery', false)

const notificationSchema = mongoose.Schema(
    {
        description: {
            type: String,
        },
        date: {
            type: Date,
        },
        link: {
            type: String,
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        Isread: {
            type: Boolean,
        }
    },
    {
        timestamps: true,
    }
)

module.exports = (conn) => conn.model('notification', notificationSchema);