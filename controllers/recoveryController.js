const asyncHandler = require('express-async-handler')
const RecoveryModel = require('../models/recoveryModel')
const Recovery = RecoveryModel.RecoveryModal;
const addRecovery = asyncHandler(async (req, res) => {
    try {
        await Recovery.create({
            Customer: req.body.customer,
            Amount: req.body.amount,
            Reminder: req.body.reminder,
            Note: req.body.note,
            Status: "In Complete",
            is_active: true,
            addedBy: req.user._id,

        });
        return res.status(200).json({
            success: true,
            msg: "Recovery added successfully"
        });
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
    var condition = { is_active: req.body.active };
    if(req.body.status)
    {
        condition.Status=req.body.status;
    }
    try {
        let RecoveryList = await Recovery.find(condition).populate("Customer").populate("addedBy", "_id name email role")
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
module.exports = {
    addRecovery,
    getAllRecovery,
    getRecoveryById,
    removeRecovery,
    editRecovery,
    complateRecovery
}