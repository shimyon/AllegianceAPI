const asyncHandler = require('express-async-handler')
const RecoveryModel = require('../models/recoveryModel')
const Recovery = RecoveryModel.RecoveryModal;
const User = require('../models/userModel')
const notificationModel = require('../models/notificationModel')
const addRecovery = asyncHandler(async (req, res) => {
    try {
        let recoveryNo = await Recovery.find({}, { RecoveryNo: 1, _id: 0 }).sort({ RecoveryNo: -1 }).limit(1);
        let maxRecovery = 1;
        if (recoveryNo.length > 0) {
            maxRecovery = recoveryNo[0].RecoveryNo + 1;
        }
        const newRecovery = await Recovery.create({
            Customer: req.body.customer,
            RecoveryNo: maxRecovery,
            Amount: req.body.amount,
            Reminder: req.body.reminder,
            NextFollowup: req.body.nextfollowup,
            Note: req.body.note,
            Status: "In Complete",
            is_active: true,
            addedBy: req.user._id,

        });
        if (newRecovery) {
            // let resuser = await User.find({ is_active: true, role: 'SuperAdmin' });
            // let date = new Date();
            // let insertdata = resuser.map(f => ({
            //     description: `Recovery(${newRecovery.RecoveryNo}) entry has been created`,
            //     date: date,
            //     link: "Recovery",
            //     userId: f._id,
            //     Isread: false
            // }));
            // if (insertdata.length > 0) {
            //     const savedNotification = await notificationModel.insertMany(insertdata);
            // }
            return res.status(200).json(newRecovery).end();
        }
        else {
            res.status(400)
            throw new Error("Invalid Recovery data!")
        }
    } catch (err) {
        return res.status(400).json({
            success: false,
            msg: "Error in adding Recovery. " + err.message
        });
    }
})

const editRecovery = asyncHandler(async (req, res) => {
    try {
        var existing = await Recovery.findById(req.body.id);
        if (!existing) {
            return res.status(400).json({
                success: false,
                msg: "Recovery not found. " + err.message,
            });

        }
        await Recovery.findByIdAndUpdate(req.body.id, {
            Customer: req.body.customer,
            Amount: req.body.amount,
            Reminder: req.body.reminder,
            NextFollowup: req.body.nextfollowup,
            Note: req.body.note,
            is_active: true,
            addedBy: req.user._id,
        });
        return res.status(200).json({
            success: true,
            msg: "Recovery updated successfully"
        });
    } catch (err) {
        return res.status(400).json({
            success: false,
            msg: "Error in updating Recovery. " + err.message
        });
    }
})

const complateRecovery = asyncHandler(async (req, res) => {
    try {
        var existing = await Recovery.findById(req.params.id);
        if (!existing) {
            return res.status(400).json({
                success: false,
                msg: "Recovery not found. " + err.message,
            });

        }
        await Recovery.findByIdAndUpdate(req.params.id, {
            Status: "Completed",
        });
        return res.status(200).json({
            success: true,
            msg: "Recovery updated successfully"
        });
    } catch (err) {
        return res.status(400).json({
            success: false,
            msg: "Error in updating Recovery. " + err.message
        });
    }
})

const getAllRecovery = asyncHandler(async (req, res) => {
    try {
        let { skip, per_page } = req.body;
        let query = [];
        query.push({
            $match: { is_active: req.body.active }
        });
        query.push(
            {
                '$lookup': {
                    'from': 'customers',
                    'localField': 'Customer',
                    'foreignField': '_id',
                    'as': 'Customer'
                }
            },
            {
                $unwind: {
                    path: '$Customer'
                },
            },
            {
                $sort: { createdAt: -1 }
            }
        );

        if (req.body.status) {
            query.push(
                {
                    $match: { Status: req.body.status },
                });
        }

        if (req.body.filter) {
            query.push(
                {
                    $match: { "Customer.Company": { $regex: new RegExp(req.body.filter, "i") } },
                });
        }
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
        const RecoveryList = await Recovery.aggregate(query).exec();
        if (RecoveryList.length == 0) {
            return res.status(200).json({
                success: true,
                data: { Count: 0, data: [] }
            }).end();
        }
        else {
            return res.status(200).json({
                success: true,
                data: RecoveryList[0]
            }).end();
        }
    } catch (err) {
        return res.status(400).json({
            success: false,
            msg: "Error in getting Recovery. " + err.message,
            data: null,
        });
    }

});

const getRecoveryById = asyncHandler(async (req, res) => {
    try {
        let RecoveryList = await Recovery.find({ _id: req.params.id }).populate("Customer").populate("addedBy", "_id name email role");
        return res.status(200).json({
            success: true,
            data: RecoveryList
        }).end();
    } catch (err) {
        return res.status(400).json({
            success: false,
            msg: "Error in getting Recovery. " + err.message,
            data: null,
        });
    }

});

const removeRecovery = asyncHandler(async (req, res) => {
    try {
        const existRecovery = await Recovery.findById(req.body.id);
        if (!existRecovery) {
            return res.status(200).json({
                success: false,
                msg: "Recovery not found.",
                data: null,
            });
        }

        const newRecovery = await Recovery.findByIdAndUpdate(req.body.id, {
            is_active: req.body.active
        });

        return res.status(200).json({
            success: true,
            msg: "Recovery removed. ",
            data: null
        }).end();
    } catch (err) {
        return res.status(400).json({
            success: false,
            msg: "Error in removing Recovery. " + err.message,
            data: null,
        });
    }

});

const deleteRecovery = asyncHandler(async (req, res) => {
    try {
        await Recovery.deleteOne({ _id: req.params.id }).lean().exec((err, doc) => {
            if (err) {
                return res.status(401).json({
                    success: false,
                    msg: err
                }).end();
            } else {
                return res.status(200).json({
                    success: true,
                    msg: "Recovery removed. ",
                }).end();
            }
        });

    } catch (err) {
        return res.status(400).json({
            success: false,
            msg: "Error in removing Recovery. " + err.message,
            data: null,
        });
    }

});

module.exports = {
    addRecovery,
    getAllRecovery,
    getRecoveryById,
    removeRecovery,
    editRecovery,
    complateRecovery,
    deleteRecovery
}