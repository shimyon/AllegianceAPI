const asyncHandler = require('express-async-handler')
const TaskModal = require('../models/taskModel')
const Tasks = TaskModal.TaskModal
const TaskComments = TaskModal.TaskCommentModal
const { sendMail } = require('../middleware/sendMail')
const Users = require('../models/userModel')
const SassMaster = require('../models/saasmasterModel');
const Statuss = SassMaster.StatusModal;
const moment = require('moment')
const LeadModal = require('../models/leadModel')
const Leads = LeadModal.LeadsModal;
const ProspectModal = require('../models/prospectModel');
const Prospects = ProspectModal.ProspectsModal;
const Notificationss = require('../models/notificationModel')
const ContractModel = require('../models/contractModel')
const Processs = ContractModel.ContractProcess;
const SubProcesss = ContractModel.ContractSubProcess;
const uploadFile = require("../middleware/uploadFileMiddleware");

const addtask = asyncHandler(async (req, res) => {
    try {
        process.env.UPLOADFILE = "";
        await uploadFile(req, res, function (err) {
            if (err) {
                return ("Error uploading file.");
            } else {
                saveTask(req, res, process.env.UPLOADFILE)
            }
        })
    } catch (err) {
        return res.status(400).json({
            success: false,
            msg: "Error in adding data. " + err.message,
            data: null,
        });
    }
});
const saveTask = asyncHandler(async (req, res, fileName) => {
    try {
        let Task = Tasks(req.conn);
        let User = Users(req.conn);
        let Notifications = Notificationss(req.conn);
        let taskadd = await Task.create({
            LeadId: req.body.LeadId||null,
            ProspectId: req.body.ProspectId||null,
            ProcessId: req.body.ProcessId||null,
            SubProcessId: req.body.SubProcessId||null,
            Name: req.body.Name,
            Description: req.body.Description,
            image: fileName.replace(",", ""),
            Status: req.body.Status||null,
            Assign: req.body.Assign||null,
            Reporter: req.body.Reporter||null,
            Priority: req.body.Priority,
            StartDate: req.body.StartDate,
            EndDate: req.body.EndDate,
            is_active: true,
            addedBy: req.user._id
        });
        if (taskadd.Assign) {
            let TaskList = await Task.findOne({ _id: taskadd._id }).populate("Assign").populate("addedBy")
            let html =
                `<html>Hello,<br/><br/>Please take up the following task (${req.body.Name})<br/>${req.body.Description}<br/><br/>Please finish it by ${moment(req.body.EndDate).format("DD-MMM-YY")}<br/><br/>Thank you,<br/><b>${TaskList.addedBy?.name}</b></html>`;
            sendMail(TaskList?.Assign.email, "New Task", html, req);
            const notification = await Notifications.create({
                description: `A new task (${taskadd.Name}) has been assigned to you.`,
                date: new Date(),
                link: "Tasks", 
                userId: taskadd.Assign, 
                Isread: false
            });
        }
        return res.status(200).json({
            success: true,
            msg: "Task Added.",
        }).end();
    } catch (err) {
        return res.status(400).json({
            success: false,
            msg: "Error in creating Task. " + err.message,
            data: null,
        });
    }
});
const edittask = asyncHandler(async (req, res) => {
    try {
        process.env.UPLOADFILE = "";
        await uploadFile(req, res, function (err) {
            if (err) {
                return ("Error uploading file.");
            } else {
                editSave(req, res, process.env.UPLOADFILE)
            }
        })

    } catch (err) {
        return res.status(400).json({
            success: false,
            msg: "Error in editing data. " + err.message,
            data: null,
        });

    }
});
const editSave = asyncHandler(async (req, res) => {
    try {
        let Task = Tasks(req.conn);
        let User = Users(req.conn);
        let Status = Statuss(req.conn);
        let Notifications = Notificationss(req.conn);
        fileName = fileName != "" ? fileName.replace(",", "") : existNews.image;
        const oldTask = await Task.findById(req.body.id);
        await Task.findByIdAndUpdate(req.body.id, {
            Name: req.body.Name,
            Description: req.body.Description,
            Status: req.body.Status,
            Assign: req.body.Assign,
            Reporter: req.body.Reporter,
            Priority: req.body.Priority,
            StartDate: req.body.StartDate,
            EndDate: req.body.EndDate,
            image: fileName
        });
        const task = await Task.findById(req.body.id).populate("Reporter").populate("Status").populate("Assign").populate("addedBy");
        if (oldTask.Status !== req.body.Status) {
            
            const html = `<html>Hello,<br/><br/>The status of the task (${task.Name}) has been changed to (${task.Status?.Name}).<br/><br/>Thank you,<br/><b>(${task.addedBy?.name})</b></html>`;
            task.Reporter.forEach((x) => {
                if (x) {
                    sendMail(x.email, "Task Status is changed", html, req);
                    Notifications.create({
                        description: `The status of the task (${task.Name}) has been updated to ${task.Status?.Name}.`,
                        date: new Date(),
                        link: "Tasks",
                        userId: x._id,
                        Isread: false
                    });
                }
            })
            if (task.Assign) {
                Notifications.create({
                    description: `The status of the task (${task.Name}) has been updated to ${task.Status?.Name}.`,
                    date: new Date(),
                    link: "Tasks",
                    userId: task.Assign,
                    Isread: false
                });
            }            
        }

        return res.status(200).json({
            success: true,
            msg: "Task Updated",
        }).end();
    } catch (err) {
        return res.status(400).json({
            success: false,
            msg: "Error in creating Task. " + err.message,
            data: null,
        });
    }

});
const addtaskcomment = asyncHandler(async (req, res) => {
    try {
        let TaskComment = TaskComments(req.conn);
        let Task = Tasks(req.conn);
        let taskCommentadd = await TaskComment.create({
            taskId: req.body.taskId,
            TaskComment: req.body.Taskcomment,
            addedBy: req.user._id
        });
        if (taskCommentadd) {
            await Task.findByIdAndUpdate(req.body.taskId, {
                LastComment: taskCommentadd._id
            });
        }
        return res.status(200).json({
            success: true,
            msg: "Task Comment Added.",
        }).end();
    } catch (err) {
        return res.status(400).json({
            success: false,
            msg: "Error in creating Task Comment. " + err.message,
            data: null,
        });
    }
});
const getAlltaskcomment = asyncHandler(async (req, res) => {
    try {
        let TaskComment = TaskComments(req.conn);
        let User = Users(req.conn);
        let CommentList = await TaskComment.find({ taskId: req.body.taskId }).populate("addedBy", "_id name").sort({ createdAt: -1 })
        return res.status(200).json({
            success: true,
            data: CommentList
        }).end();
    } catch (err) {
        return res.status(400).json({
            success: false,
            msg: "Error in getting Task Comment. " + err.message,
            data: null,
        });
    }
});

const taskreason = asyncHandler(async (req, res) => {
    try {
        let Task = Tasks(req.conn);
        
        await Task.findByIdAndUpdate(req.body.taskId, {
            Reason: req.body.Reason
        });
        return res.status(200).json({
            success: true,
            msg: "Task Updated",
        }).end();
    } catch (err) {
        return res.status(400).json({
            success: false,
            msg: "Error in creating Task. " + err.message,
            data: null,
        });
    }

});

const removetask = asyncHandler(async (req, res) => {
    try {
        let Task = Tasks(req.conn);
        const existCustomer = await Task.findById(req.params.id);
        if (!existCustomer) {
            return res.status(200).json({
                success: false,
                msg: "Task not found."
            });
        }

        const newTask = await Task.findByIdAndUpdate(req.params.id, {
            is_active: false
        });

        return res.status(200).json({
            success: true,
            msg: "Task removed. "
        }).end();
    } catch (err) {
        return res.status(400).json({
            success: false,
            msg: "Error in removing Task. " + err.message
        });
    }

});

const getAlltask = asyncHandler(async (req, res) => {
    let Task = Tasks(req.conn);
    let User = Users(req.conn);
    let Status = Statuss(req.conn);
    let Lead = Leads(req.conn);
    let Prospect = Prospects(req.conn);
    let Process = Processs(req.conn);
    let SubProcess = SubProcesss(req.conn);


    var inboxcondition = { is_active: req.body.active, Assign: req.body.user };
    var outboxcondition = { is_active: req.body.active, addedBy: req.body.user, Assign: { $ne: req.body.user } };
    if (req.body.status) {
        inboxcondition.Status = req.body.status;
        outboxcondition.Status = req.body.status;
    }
    try {
        let inboxList = await Task.find(inboxcondition).populate("Status").populate("Assign", "_id name").populate("addedBy", "_id name").populate("LeadId").populate("ProspectId").populate("ProcessId").populate("SubProcessId")
            .sort({ createdAt: -1 })
        let outboxList = await Task.find(outboxcondition).populate("Status").populate("Assign", "_id name").populate("addedBy", "_id name").populate("LeadId").populate("ProspectId").populate("ProcessId").populate("SubProcessId")
            .sort({ createdAt: -1 })
        return res.status(200).json({
            success: true,
            data: { 'Inbox': inboxList, 'Outbox': outboxList }
        }).end();
    } catch (err) {
        return res.status(400).json({
            success: false,
            msg: "Error in getting Task. " + err.message,
            data: null,
        });
    }
})

const gettaskById = asyncHandler(async (req, res) => {
    try {
        let Task = Tasks(req.conn);        
        let TaskList = await Task.findOne({ _id: req.params.id })

        return res.status(200).json({
            success: true,
            data: TaskList
        }).end();
    } catch (err) {
        return res.status(400).json({
            success: false,
            msg: "Error in getting Task. " + err.message,
            data: null,
        });
    }
})

const gettaskboardCount = asyncHandler(async (req, res) => {
    try {        
        let Status = Statuss(req.conn);
        const Lookup = await Status.aggregate([
            {
                '$match': {
                    'GroupName': 'Tasks'
                }
            }, {
                '$lookup': {
                    'from': 'tasks',
                    'localField': '_id',
                    'foreignField': 'Status',
                    'as': 'tasks'
                }
            }, {
                '$addFields': {
                    'tasksid': '$tasks.Assign'
                }
            }, {
                '$project': {
                    'Name': 1,
                    'tasksid': 1,
                    'tasksnewid': {
                        '$filter': {
                            'input': '$tasksid',
                            'as': 'item',
                            'cond': {
                                '$eq': [
                                    '$$item', req.user._id
                                ]
                            }
                        }
                    }
                }
            }, {
                '$addFields': {
                    'count': {
                        '$size': '$tasksnewid'
                    }
                }
            }
        ]);
        return res.status(200).json({
            success: true,
            data: Lookup
        }).end();
    } catch (err) {
        return res.status(400).json({
            success: false,
            msg: "Error in getting count. " + err.message,
            data: null,
        });
    }
})

module.exports = {
    addtask,
    edittask,
    removetask,
    getAlltask,
    gettaskById,
    gettaskboardCount,
    addtaskcomment,
    getAlltaskcomment,
    taskreason
}