const asyncHandler = require('express-async-handler')
const ContractModel = require('../models/contractModel')
const Contract = ContractModel.ContractModal;
const uploadFile = require("../middleware/uploadFileMiddleware");

const addContract = asyncHandler(async (req, res) => {
    try {
        process.env.UPLOADFILE = "";
        await uploadFile(req, res, function (err) {
            if (err) {
                return ("Error uploading file.");
            } else {
                insertContract(req, res, process.env.UPLOADFILE)
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


const insertContract = asyncHandler(async (req, res, fileName) => {
    try {
        var fileList = [];
        var files = fileName.split(",");
        for (var i = 0; i < files.length; i++) {
            if (files[i] != "") {
                fileList.push(files[i]);
            }
        }
        await Contract.create({
            Customer: req.body.customer,
            ContractNo: req.body.contracNo,
            StartDate: req.body.startDate,
            ExpiryDate: req.body.expiryDate,
            Type: req.body.type,
            Item: req.body.item,
            Description: req.body.description,
            ContractCharges: req.body.contractCharges,
            RenewalCharges: req.body.renewalCharges,
            Files: fileList,
            is_active: true,
            addedBy: req.user._id,

        });
        return res.status(200).json({
            success: true,
            msg: "Contract added successfully"
        });
    } catch (err) {
        return res.status(400).json({
            success: false,
            msg: "Error in adding contract. " + err.message
        });
    }
})

const editContract = asyncHandler(async (req, res) => {
    try {
        process.env.UPLOADFILE = "";
        await uploadFile(req, res, function (err) {
            if (err) {
                return ("Error uploading file.");
            } else {
                insertEditContract(req, res, process.env.UPLOADFILE)
            }
        })

    } catch (err) {
        return res.status(400).json({
            success: false,
            msg: "Error in adding data. " + err.message,
        });

    }
})

const insertEditContract = asyncHandler(async (req, res, fileName) => {
    try {
        var existing= await Contract.findById(req.body.id);
        if(!existing)
        {
            return res.status(400).json({
                success: false,
                msg: "Contract not found. " + err.message,
            });
    
        }

        var fileList = existing.Files;
        var files = fileName.split(",");
        for (var i = 0; i < files.length; i++) {
            if (files[i] != "") {
                fileList.push(files[i]);
            }
        }
        await Contract.create({
            Customer: req.body.customer,
            ContractNo: req.body.contracNo,
            StartDate: req.body.startDate,
            ExpiryDate: req.body.expiryDate,
            Type: req.body.type,
            Item: req.body.item,
            Description: req.body.description,
            ContractCharges: req.body.contractCharges,
            RenewalCharges: req.body.renewalCharges,
            Files: fileList,
            addedBy: req.user._id,

        });
        return res.status(200).json({
            success: true,
            msg: "Contract updated successfully"
        });
    } catch (err) {
        return res.status(400).json({
            success: false,
            msg: "Error in updating contract. " + err.message
        });
    }
})

const getAllContract = asyncHandler(async (req, res) => {
    try {
        let ContractList = await Contract.find({ is_active: req.body.active }).populate("Customer").populate("addedBy", "_id name email role")
        return res.status(200).json({
            success: true,
            data: ContractList
        }).end();
    } catch (err) {
        return res.status(400).json({
            success: false,
            msg: "Error in getting Contract. " + err.message,
            data: null,
        });
    }

});

const getContractById = asyncHandler(async (req, res) => {
    try {
        let ContractList = await Contract.find({_id:req.params.id }).populate("Customer").populate("addedBy", "_id name email role");
        return res.status(200).json({
            success: true,
            data: ContractList
        }).end();
    } catch (err) {
        return res.status(400).json({
            success: false,
            msg: "Error in getting Contract. " + err.message,
            data: null,
        });
    }

});

const removeContract = asyncHandler(async (req, res) => {
    try {
        const existContract = await Contract.findById(req.body.id);
        if (!existContract) {
            return res.status(200).json({
                success: false,
                msg: "Contract not found.",
                data: null,
            });
        }

        const newContract = await Contract.findByIdAndUpdate(req.body.id, {
            is_active: req.body.active
        });

        return res.status(200).json({
            success: true,
            msg: "Contract removed. ",
            data: null
        }).end();
    } catch (err) {
        return res.status(400).json({
            success: false,
            msg: "Error in removing Contract. " + err.message,
            data: null,
        });
    }

});
module.exports = {
    addContract,
    getAllContract,
    getContractById,
    removeContract,
    editContract
}