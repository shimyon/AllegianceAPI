const asyncHandler = require('express-async-handler')
const ContractModel = require('../models/contractModel')
const Contracts = ContractModel.ContractModal;
const Processs = ContractModel.ContractProcess;
const SubProcess = ContractModel.ContractSubProcess;
const TaskModal = require('../models/taskModel');
const Task = TaskModal.TaskModal;
const DailyStatuss = ContractModel.ProcessDailyStatus;
const Users = require('../models/userModel')
const CustomerModal = require('../models/customerModel')
const Customers = CustomerModal.CustomerModal

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
        let Contract = Contracts(req.conn);
        let contractNo = await Contract.find({}, { ContractNo: 1, _id: 0 }).sort({ ContractNo: -1 }).limit(1);
        let maxcontractNo = 1;
        if (contractNo.length > 0) {
            maxcontractNo = contractNo[0].ContractNo + 1;
        }
        await Contract.create({
            Customer: req.body.customer,
            Name: req.body.name,
            ContractNo: maxcontractNo,
            executive: req.body.executive,
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
        let Contract = Contracts(req.conn);
        var existing = await Contract.findById(req.body.id);
        if (!existing) {
            return res.status(400).json({
                success: false,
                msg: "Contract not found. ",
            });

        }

        var param = {
            Customer: req.body.customer,
            Name: req.body.name,
            StartDate: req.body.startDate,
            executive: req.body.executive,
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
        var nData = await Contract.findByIdAndUpdate(req.body.id, param);
        return res.status(200).json({
            success: true,
            msg: "Updated Successfully",
            data: nData
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
        let Contract = Contracts(req.conn);
        let User = Users(req.conn)
        let Customer = Customers(req.conn);
        let Process = Processs(req.conn);

        let ContractList = await Contract.find({ is_active: req.body.active }).populate("Process").populate("executive").populate("Customer").populate("addedBy", "_id name email role")
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
        let Contract = Contracts(req.conn);      
        let User = Users(req.conn)
        let Customer = Customers(req.conn);
        let Process = Processs(req.conn);

        let ContractList = await Contract.find({ _id: req.params.id }).populate("Process").populate("executive").populate("Customer").populate("addedBy", "_id name email role");
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
        let Contract = Contracts(req.conn);
        let Process = Processs(req.conn);

        var oldContract = await Contract.findById(req.body.contractId);
        if (!oldContract) {
            return res.status(400).json({
                success: false,
                msg: "Contract not found"
            });
        }
        let newProcess = await Process.create({
            contractId: req.body.contractId,
            Name: req.body.name,
            executive: req.body.executive,
            note: req.body.note,
            startDate: req.body.startDate,
            dueDate: req.body.dueDate,
            addedBy: req.user._id,

        });
        oldContract.Process.push(newProcess);
        oldContract.save((err) => {
            if (err) throw err;
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
        let Process = Processs(req.conn);

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
        let User = Users(req.conn)
        let Customer = Customers(req.conn);
        let Process = Processs(req.conn);
        let SubProcesss = SubProcess(req.conn);
        let DailyStatus = DailyStatuss(req.conn);


        let ProcessList = await Process.find({ contractId: req.body.contractId }).populate({
            path: 'subProcess',
            populate: [{ path: "dailyStatus" }, { path: "executive" }, { path: "addedBy" }]
        }).populate("executive").populate("addedBy", "_id name email role")
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
        let User = Users(req.conn);        
        let Process = Processs(req.conn);
        let SubProcesss = SubProcess(req.conn);

        let ProcessList = await Process.find({ _id: req.body.processId }).populate({
            path: 'subProcess',
            populate: [{ path: "dailyStatus" }, { path: "executive" }, { path: "addedBy" }]
        }).populate("addedBy", "_id name email role");
        let tasklist = await Task.find({ is_active: true, ProcessId:  req.body.processId }).populate("Status").populate("Assign");
        return res.status(200).json({
            success: true,
            data:{ ProcessList, tasklist}
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
        let Process = Processs(req.conn);
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
        let Contract = Contracts(req.conn);
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

const addDailyStatus = asyncHandler(async (req, res) => {
    try {
          
        let Process = Processs(req.conn);
        let SubProcesss = SubProcess(req.conn);
        let Contract = Contracts(req.conn);
        let DailyStatus = DailyStatuss(req.conn);

        let oldSubProcess = await SubProcesss.findById(req.body.subProcessId);
        let oldProcess = await Process.findById(oldSubProcess.processId);

        if (!oldSubProcess) {
            return res.status(400).json({
                success: false,
                msg: "Sub process not found"
            });
        }
        let newStatus = await DailyStatus.create({
            subProcessId: req.body.subProcessId,
            note: req.body.note,
            progress: req.body.progress,
            addedBy: req.user._id,
            Date: req.body.Date
        });
        oldSubProcess.dailyStatus.push(newStatus);
        oldSubProcess.progress = req.body.progress;
        await oldSubProcess.save((err) => {
            if (err) throw err;
        });

        let exProcess = await SubProcesss.find({ processId: oldSubProcess.processId });
        let tProgress = 0;
        let cProgress = 0;
        let percent1 = 0;
        let percent2 = 0;
        let totalProgress = 100 * exProcess.length;
        for (var i = 0; i < exProcess.length; i++) {
            var pro = exProcess[i]._id == req.body.subProcessId ? parseInt(req.body.progress) : exProcess[i].progress;
            tProgress += pro;
        }
        if (tProgress > 0) {
            percent1 = (tProgress * 100) / totalProgress;
            await Process.findByIdAndUpdate(oldSubProcess.processId, {
                progress: percent1
            })
        }

        let contract = await Process.find({ contractId: oldProcess.contractId });
        let totalcontract = 100 * contract.length;
        for (var i = 0; i < contract.length; i++) {
            // var cro =  contract[i].progress;
            cProgress += contract[i].progress;
        }
        if (cProgress > 0) {
            percent2 = (cProgress * 100) / totalcontract;
            await Contract.findByIdAndUpdate(oldProcess.contractId, {
                progress: percent2
            })
        }

        return res.status(200).json({
            success: true,
            msg: "Daily status added",
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

const addSubProcess = asyncHandler(async (req, res) => {
    try {      
        let Process = Processs(req.conn);
        let SubProcesss = SubProcess(req.conn);       

        var oldProcess = await Process.findById(req.body.processId);
        if (!oldProcess._id) {
            return res.status(400).json({
                success: false,
                msg: "Process not found. "
            });
        }
        var newSubProcess = await SubProcesss.create({
            processId: req.body.processId,
            Name: req.body.name,
            executive: req.body.executive,
            note: req.body.note,
            startDate: req.body.startDate,
            dueDate: req.body.dueDate,
            addedBy: req.user._id,

        });
        oldProcess.subProcess.push(newSubProcess);
        oldProcess.save((err) => {
            if (err) throw err;
        });
        return res.status(200).json({
            success: true,
            msg: "Sub Process added successfully"
        });
    } catch (err) {
        return res.status(400).json({
            success: false,
            msg: "Error in adding sub Process. " + err.message
        });
    }
})

const editSubProcess = asyncHandler(async (req, res) => {
    try {
        let SubProcesss = SubProcess(req.conn);

        var oldProcess = SubProcesss.findById(req.body.id);
        if (!oldProcess) {
            return res.status(400).json({
                success: false,
                msg: "Sub Process not exist"
            });
        }
        await SubProcesss.findByIdAndUpdate(req.body.id, {
            executive: req.body.executive,
            Name: req.body.name,
            note: req.body.note,
            startDate: req.body.startDate,
            dueDate: req.body.dueDate,

        });
        return res.status(200).json({
            success: true,
            msg: "Sub Process updated successfully"
        });
    } catch (err) {
        return res.status(400).json({
            success: false,
            msg: "Error in updating. " + err.message
        });
    }
})

const getSubAllProcess = asyncHandler(async (req, res) => {
    try {
        let User = Users(req.conn);   
        let SubProcesss = SubProcess(req.conn);
        let DailyStatus = DailyStatuss(req.conn);

        let ProcessList = await SubProcesss.find({ processId: req.body.processId }).populate("dailyStatus").populate("executive").populate("addedBy", "_id name email role")
        return res.status(200).json({
            success: true,
            data: ProcessList
        }).end();
    } catch (err) {
        return res.status(400).json({
            success: false,
            msg: "Error in getting SubProcess. " + err.message,
            data: null,
        });
    }

});

const getSubProcessById = asyncHandler(async (req, res) => {
    try {
        let User = Users(req.conn); 
        let SubProcesss = SubProcess(req.conn);       
        let DailyStatus = DailyStatuss(req.conn);

        let ProcessList = await SubProcesss.find({ _id: req.body.subProcessId }).populate("dailyStatus").populate("addedBy", "_id name email role");

        return res.status(200).json({
            success: true,
            data: {ProcessList, tasklist}
        }).end();
    } catch (err) {
        return res.status(400).json({
            success: false,
            msg: "Error in getting Sub Process. " + err.message,
            data: null,
        });
    }

});

const removeSubProcess = asyncHandler(async (req, res) => {
    try {        
        let SubProcesss = SubProcess(req.conn);       

        const existProcess = await SubProcesss.findById(req.params.id);
        if (!existProcess) {
            return res.status(200).json({
                success: false,
                msg: "Sub Process not found.",
                data: null,
            });
        }

        await SubProcesss.remove({ _id: req.params.id }, function (err) {
            if (!err) {

                return res.status(200).json({
                    success: true,
                    msg: "Sub Process removed. ",
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

const getAllDailyStatus = asyncHandler(async (req, res) => {
    try {
        let User = Users(req.conn);     
        let DailyStatus = DailyStatuss(req.conn);

        let StatusList = await DailyStatus.find({ subProcessId: req.params.id }).populate("addedBy", "_id name email role").sort({ createdAt: -1 })
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
    addDailyStatus,
    getAllDailyStatus,
    addSubProcess,
    editSubProcess,
    getSubAllProcess,
    getSubProcessById,
    removeSubProcess
}