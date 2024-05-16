const { ObjectId } = require('mongodb');
const asyncHandler = require('express-async-handler')
const notificationModel = require('../models/notificationModel')

const getAllNotificationByUId = asyncHandler(async (req, res) => {
    try {
        let { skip, per_page } = req.body;
        let query = [];
        if (req.body.userId) {
            query.push({
                $match: { userId: ObjectId(req.body.userId) }
            });
        }
        query.push(
            {
                $sort: { createdAt: -1 }
            }
        );
        query.push(
            {
                $facet: {
                    stage1: [
                        {
                            $group: {
                                _id: null,
                                count: {
                                    $sum: 1,
                                },
                            },
                        },
                    ],
                    stage2: [
                        {
                            $skip: skip,
                        },
                        {
                            $limit: per_page,
                        },
                    ],
                },
            },
            {
                $unwind: {
                    path: '$stage1'
                },
            },
            {
                $project: {
                    count: "$stage1.count",
                    data: "$stage2",
                },
            }
        )
        const notification = await notificationModel.aggregate(query).exec();
        if (notification.length == 0) {
            return res.status(200).json({
                success: true,
                data: { Count: 0, data: [] }
            }).end();
        }
        else {
            return res.status(200).json({
                success: true,
                data: notification[0]
            }).end();
        }
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



