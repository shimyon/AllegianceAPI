const asyncHandler = require('express-async-handler')
const ContractModel = require('../models/contractModel')
const Contract = ContractModel.ContractModal;
const Process = ContractModel.ContractProcess;
const DailyStatus= ContractModel.ProcessDailyStatus;
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
            Name: req.body.name,
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
        var existing = await Contract.findById(req.body.id);
        if (!existing) {
            return res.status(400).json({
                success: false,
                msg: "Contract not found. ",
            });

        }

        await Contract.findByIdAndUpdate(req.body.id, {
            Customer: req.body.customer,
            Name: req.body.name,
            ContractNo: req.body.contracNo,
            StartDate: req.body.startDate,
            ExpiryDate: req.body.expiryDate,
            Type: req.body.type,
            Item: req.body.item,
            Description: req.body.description,
            ContractCharges: req.body.contractCharges,
            RenewalCharges: req.body.renewalCharges,
            Files: fileName,
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
        let ContractList = await Contract.find({ is_active: req.body.active }).populate("Process").populate("Customer").populate("addedBy", "_id name email role")
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
        let ContractList = await Contract.find({ _id: req.body.id }).populate("Process").populate("Customer").populate("addedBy", "_id name email role");
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

const addProcess = asyncHandler(async (req, res) => {
    try {

        await Process.create({
            contractId: req.body.contractId,
            Name: req.body.name,
            executive: req.body.executive,
            status: req.body.status,
            note: req.body.note,
            startDate: req.body.startDate,
            dueDate: req.body.dueDate,
            addedBy: req.user._id,

        });
        return res.status(200).json({
            success: true,
            msg: "Process added successfully"
        });
    } catch (err) {
        return res.status(400).json({
            success: false,
            msg: "Error in adding Process. " + err.message
        });
    }
})

const editProcess = asyncHandler(async (req, res) => {
    try {
        var oldProcess = Process.findById(req.body.id);
        if (!oldProcess) {
            return res.status(400).json({
                success: false,
                msg: "Process not exist"
            });
        }
        await Process.findByIdAndUpdate(req.body.id, {
            executive: req.body.executive,
            Name: req.body.name,
            status: req.body.status,
            note: req.body.note,
            startDate: req.body.startDate,
            dueDate: req.body.dueDate,

        });
        return res.status(200).json({
            success: true,
            msg: "Process updated successfully"
        });
    } catch (err) {
        return res.status(400).json({
            success: false,
            msg: "Error in updating Process. " + err.message
        });
    }
})

const getAllProcess = asyncHandler(async (req, res) => {
    try {
        let ProcessList = await Process.find({ contractId: req.body.contractId }).populate("dailyStatus").populate("executive").populate("addedBy", "_id name email role")
        return res.status(200).json({
            success: true,
            data: ProcessList
        }).end();
    } catch (err) {
        return res.status(400).json({
            success: false,
            msg: "Error in getting Process. " + err.message,
            data: null,
        });
    }

});

const getProcessById = asyncHandler(async (req, res) => {
    try {
        let ProcessList = await Process.find({ _id: req.body.processId }).populate("executive").populate("addedBy", "_id name email role");
        return res.status(200).json({
            success: true,
            data: ProcessList
        }).end();
    } catch (err) {
        return res.status(400).json({
            success: false,
            msg: "Error in getting Process. " + err.message,
            data: null,
        });
    }

});

const removeProcess = asyncHandler(async (req, res) => {
    try {
        const existProcess = await Process.findById(req.params.id);
        if (!existProcess) {
            return res.status(200).json({
                success: false,
                msg: "Process not found.",
                data: null,
            });
        }

         await Process.remove({ _id: req.params.id }, function (err) {
            if (!err) {

                return res.status(200).json({
                    success: true,
                    msg: "Process removed. ",
                }).end();
            }
            else {
                return res.status(400).json({
                    success: false,
                    msg: "Error in removing Process. " + err,
                }).end();
            }
        });

    } catch (err) {
        return res.status(400).json({
            success: false,
            msg: "Error in removing Process. " + err.message,
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

const updateProcess = asyncHandler(async (req, res) => {
    try {
         await Process.findByIdAndUpdate(req.body.id,{
            status: req.body.status
         } );
        return res.status(200).json({
            success: true,
            msg:"Status updated"
        }).end();
    } catch (err) {
        return res.status(400).json({
            success: false,
            msg: "Error in getting Process. " + err.message,
            data: null,
        });
    }

});

const addDailyStatus = asyncHandler(async (req, res) => {
    try {
        let oldProgress = await Process.findById(req.body.processId);


        let newStatus = await DailyStatus.create({
            processId: req.body.processId,
            status: req.body.status,
            note:req.body.note,
            progress: req.body.progress,
            addedBy: req.user._id,
        });
        oldProgress.dailyStatus.push(newStatus);
        oldProgress.progress= req.body.progress;
        oldProgress.save((err) => {
            if (err) throw err;
        });
        return res.status(200).json({
            success: true,
            msg:"Daily status added",
            data: newStatus
        }).end();
    } catch (err) {
        return res.status(400).json({
            success: false,
            msg: "Error in getting Process. " + err.message,
            data: null,
        });
    }

});

const getAllDailyStatus = asyncHandler(async (req, res) => {
    try {
        let StatusList = await DailyStatus.find({ processId: req.params.id }).populate("addedBy", "_id name email role")
        return res.status(200).json({
            success: true,
            data: StatusList
        }).end();
    } catch (err) {
        return res.status(400).json({
            success: false,
            msg: "Error in getting Status. " + err.message,
            data: null,
        });
    }

});
module.exports = {
    addContract,
    getAllContract,
    getContractById,
    removeContract,
    editContract,
    addProcess,
    editProcess,
    getAllProcess,
    getProcessById,
    removeProcess,
    updateProcess,
    addDailyStatus,
    getAllDailyStatus
}