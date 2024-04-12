const asyncHandler = require('express-async-handler')
const Subscription = require('../models/subscriptionModal')
const uploadFile = require("../middleware/uploadFileMiddleware");

const addSubscription = asyncHandler(async (req, res) => {
    try {
        process.env.UPLOADFILE = "";
        await uploadFile(req, res, function (err) {
            if (err) {
                return ("Error uploading file.");
            } else {
                insertSubscription(req, res, process.env.UPLOADFILE)
            }
        })

    } catch (err) {
        return res.status(400).json({
            success: false,
            msg: "Error in adding data. " + err.message,
            data: null,
        });

    }
})

const insertSubscription = asyncHandler(async (req, res, fileName) => {
    try {

        await Subscription.create({
            Customer: req.body.customer,
            ContractNo: req.body.contractNo,
            StartDate: req.body.startDate,
            ExpiryDate: req.body.expiryDate,
            Type: req.body.type,
            Item: req.body.item,
            Description: req.body.description,
            ContractCharges: req.body.contractCharges,
            RenewalCharges: req.body.renewalCharges,
            Files: fileName.replace(",", ""),
            is_active: true,
            addedBy: req.user._id,

        });
        return res.status(200).json({
            success: true,
            msg: "Subscription added successfully"
        });
    } catch (err) {
        return res.status(400).json({
            success: false,
            msg: "Error in adding Subscription. " + err.message
        });
    }
})

const editSubscription = asyncHandler(async (req, res) => {
    try {
        process.env.UPLOADFILE = "";
        await uploadFile(req, res, function (err) {
            if (err) {
                return ("Error uploading file.");
            } else {
                insertEditSubscription(req, res, process.env.UPLOADFILE)
            }
        })

    } catch (err) {
        return res.status(400).json({
            success: false,
            msg: "Error in adding data. " + err.message,
        });

    }
})

const insertEditSubscription = asyncHandler(async (req, res, fileName) => {
    try {
        var existing = await Subscription.findById(req.body.id);
        if (!existing) {
            return res.status(400).json({
                success: false,
                msg: "Subscription not found. ",
            });

        }
        var param = {
            ContractNo: req.body.contractNo,
            Customer: req.body.customer,
            StartDate: req.body.startDate,
            ExpiryDate: req.body.expiryDate,
            Type: req.body.type,
            Item: req.body.item,
            Description: req.body.description,
            ContractCharges: req.body.contractCharges,
            RenewalCharges: req.body.renewalCharges,
            addedBy: req.user._id,
        }
        if (fileName != "") {
            param.Files = fileName.replace(",", "")
        }
        var nData = await Subscription.findByIdAndUpdate(req.body.id, param);
        return res.status(200).json({
            success: true,
            msg: "Updated Successfully",
            data: nData
        });
    } catch (err) {
        return res.status(400).json({
            success: false,
            msg: "Error in updating Subscription. " + err.message
        });
    }
})

const getAllSubscription = asyncHandler(async (req, res) => {
    try {
        let SubscriptionList = await Subscription.find({ is_active: req.body.active }).populate("Type").populate("Customer").populate("addedBy", "_id name email role")
        return res.status(200).json({
            success: true,
            data: SubscriptionList
        }).end();
    } catch (err) {
        return res.status(400).json({
            success: false,
            msg: "Error in getting Subscription. " + err.message,
            data: null,
        });
    }

});

const getSubscriptionById = asyncHandler(async (req, res) => {
    try {
        let SubscriptionList = await Subscription.find({ _id: req.params.id }).populate("Customer").populate("addedBy", "_id name email role");
        return res.status(200).json({
            success: true,
            data: SubscriptionList
        }).end();
    } catch (err) {
        return res.status(400).json({
            success: false,
            msg: "Error in getting Subscription. " + err.message,
            data: null,
        });
    }

});

const removeSubscription = asyncHandler(async (req, res) => {
    try {
        const existSubscription = await Subscription.findById(req.body.id);
        if (!existSubscription) {
            return res.status(200).json({
                success: false,
                msg: "Subscription not found.",
                data: null,
            });
        }

        const newSubscription = await Subscription.findByIdAndUpdate(req.body.id, {
            is_active: req.body.active
        });

        return res.status(200).json({
            success: true,
            msg: "Subscription removed. ",
            data: null
        }).end();
    } catch (err) {
        return res.status(400).json({
            success: false,
            msg: "Error in removing Subscription. " + err.message,
            data: null,
        });
    }

});

const deleteSubscription = asyncHandler(async (req, res) => {
    try {
        await Subscription.deleteOne({ _id: req.params.id }).lean().exec((err, doc) => {
            if (err) {
                return res.status(401).json({
                    success: false,
                    msg: err
                }).end();
            } else {
                return res.status(200).json({
                    success: true,
                    msg: "Subscription removed. ",
                }).end();
            }
        });

    } catch (err) {
        return res.status(400).json({
            success: false,
            msg: "Error in removing Subscription. " + err.message,
            data: null,
        });
    }

});

module.exports = {
    addSubscription,
    getAllSubscription,
    getSubscriptionById,
    removeSubscription,
    editSubscription,
    deleteSubscription
}