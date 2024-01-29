const mongoose = require('mongoose')

const attendanceSchema = mongoose.Schema(
    {
        UserId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        Punchin_location: {
            type: String
        },
        Punchin_photo: {
            type: String
        },
        Punchin_time: {
            type: Date
        },
        Punchout_location: {
            type: String
        },
        Punchout_photo: {
            type: String
        },
        Punchout_time: {
            type: Date
        },
        addedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    },
    {
        timestamps: true,
    })

const AttendanceModal = mongoose.model('Attendance', attendanceSchema);
const syncIndex = async () => {
    await AttendanceModal.syncIndexes();
}
syncIndex();

module.exports = { AttendanceModal };