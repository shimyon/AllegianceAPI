const { ObjectId } = require('mongodb');
const asyncHandler = require('express-async-handler')
const notificationModel = require('../models/notificationModel')

const getAllNotificationByUId = asyncHandler(async (req, res) => {
    try {
        const notification = await notificationModel.find({ userId: req.body.userId }).sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            msg: "",
            data: notification,
        }).end();
    } catch (err) {
        return res.status(400).json({
            success: false,
            msg: "Error in getting status. " + err.message,
            data: null,
        });
    }
})

const setmarkasread = asyncHandler(async (req, res) => {
    try {
        const { id } = req.body;
        const notification = await notificationModel.findByIdAndUpdate(id, { Isread: true });

        res.status(200).json({
            success: notification != null,
            msg: "",
            data: notification,
        }).end();
    } catch (err) {
        return res.status(400).json({
            success: false,
            msg: "Error in getting status. " + err.message,
            data: null,
        });

    }
})

module.exports = { getAllNotificationByUId, setmarkasread }



