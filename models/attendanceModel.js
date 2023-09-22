const mongoose = require('mongoose')

const attendanceSchema = mongoose.Schema(
    {
        UserId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        startDate: {
            type: Date
        },
        endDate: {
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