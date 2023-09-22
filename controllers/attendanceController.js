const asyncHandler = require('express-async-handler')
const AttendanceModel = require('../models/attendanceModel')
const User = require('../models/userModel')
const Attendance = AttendanceModel.AttendanceModal;

const addAttendance = asyncHandler(async (req, res) => {
    try {
        const newAttendance =  await Attendance.create({
            UserId: req.body.UserId,
            startDate: req.body.startDate,
            endDate: req.body.endDate,
            addedBy: req.user._id
        });

        return res.status(200).json({
            success: true,
            msg: "Attendance added successfully"
        });
            return res.status(200).json(newAttendance).end();
    } catch (err) {
        return res.status(400).json({
            success: false,
            msg: "Error in adding Attendance. " + err.message
        });
    }
})

const editAttendance = asyncHandler(async (req, res) => {
    try {

        var existing = await Attendance.findById(req.body.id);
        if (!existing) {
            return res.status(400).json({
                success: false,
                msg: "Attendance not found. " + err.message,
            });

        }

        await Attendance.findByIdAndUpdate(req.body.id, {
            UserId: req.body.UserId,
            startDate: req.body.startDate,
            endDate: req.body.endDate,
        });
        return res.status(200).json({
            success: true,
            msg: "Attendance updated successfully"
        });
    } catch (err) {
        return res.status(400).json({
            success: false,
            msg: "Error in updating Attendance. " + err.message
        });
    }
})

const getAllAttendance = asyncHandler(async (req, res) => {
    try {
        let AttendanceList = await Attendance.find().populate("UserId").populate("addedBy", "_id name email role").sort({ createdAt: -1 })
        return res.status(200).json({
            success: true,
            data: AttendanceList
        }).end();
    } catch (err) {
        return res.status(400).json({
            success: false,
            msg: "Error in getting Attendance. " + err.message,
            data: null,
        });
    }

});

const getAttendanceById = asyncHandler(async (req, res) => {
    try {
        let AttendanceList = await Attendance.find({ _id: req.params.id }).populate("UserId").populate("addedBy", "_id name email role");
        return res.status(200).json({
            success: true,
            data: AttendanceList
        }).end();
    } catch (err) {
        return res.status(400).json({
            success: false,
            msg: "Error in getting Attendance. " + err.message,
            data: null,
        });
    }

});

const deleteAttendanceById = asyncHandler(async (req, res) => {
    try {
        await Attendance.deleteOne({ _id: req.params.id }).lean().exec((err, doc) => {
            if (err) {
                return res.status(401).json({
                    success: false,
                    msg: err
                }).end();
            } else {
                return res.status(200).json({
                    success: true,
                    msg: "Attendance removed. ",
                }).end();
            }
        });
    } catch (err) {
        return res.status(400).json({
            success: false,
            msg: "Error in getting Attendance. " + err.message,
            data: null,
        });
    }

});

module.exports = {
    addAttendance,
    getAllAttendance,
    getAttendanceById,
    editAttendance,
    deleteAttendanceById
}