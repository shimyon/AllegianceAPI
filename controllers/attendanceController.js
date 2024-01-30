const asyncHandler = require('express-async-handler')
const AttendanceModel = require('../models/attendanceModel')
const User = require('../models/userModel')
const Attendance = AttendanceModel.AttendanceModal;
const uploadFile = require("../middleware/uploadFileMiddleware");

const addAttendance = asyncHandler(async (req, res) => {
    try {
        const newAttendance = await Attendance.create({
            UserId: req.body.UserId,
            Punchin_time: req.body.Punchin_time,
            Punchout_time: req.body.Punchout_time,
            addedBy: req.user._id
        });

        return res.status(200).json({
            success: true,
            msg: "Attendance added successfully"
        });
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
            Punchin_time: req.body.Punchin_time,
            Punchout_time: req.body.Punchout_time,
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
const AppAttendance = asyncHandler(async (req, res) => {
    try {
        process.env.UPLOADFILE = "";
        await uploadFile(req, res, function (err) {
            if (err) {
                return ("Error uploading file.");
            } else {
                if (req.body.id) {
                    saveeditAttendance(req, res, process.env.UPLOADFILE)
                }
                else {
                    saveAttendance(req, res, process.env.UPLOADFILE)
                }
            }
        })

    } catch (err) {
        return res.status(400).json({
            success: false,
            msg: "Error in add/edit data. " + err.message,
            data: null,
        });

    }
})
const saveAttendance = asyncHandler(async (req, res, fileName) => {
    try {
        const newAttendance = await Attendance.create({
            UserId: req.body.UserId,
            Punchin_time: req.body.Punchin_time,
            Punchin_location: req.body.Punchin_location,
            Punchin_photo: fileName.replace(",", ""),
            addedBy: req.body.UserId
        });

        return res.status(200).json({
            success: true,
            msg: "Attendance added successfully"
        });
    } catch (err) {
        return res.status(400).json({
            success: false,
            msg: "Error in adding Attendance. " + err.message
        });
    }
})
const saveeditAttendance = asyncHandler(async (req, res, fileName) => {
    try {
        let existNews = await Attendance.findById(req.body.id);
        if (!existNews) {
            return res.status(400).json({
                success: false,
                msg: "Attendance not found"
            });
        }

        fileName = fileName != "" ? fileName.replace(",", "") : existNews.image;

        await Attendance.findByIdAndUpdate(req.body.id, {
            UserId: req.body.UserId,
            Punchout_time: req.body.Punchout_time,
            Punchout_location: req.body.Punchout_location,
            Punchout_photo: fileName,
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
module.exports = {
    addAttendance,
    getAllAttendance,
    getAttendanceById,
    editAttendance,
    deleteAttendanceById,
    AppAttendance
}