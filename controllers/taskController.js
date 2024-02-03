const asyncHandler = require('express-async-handler')
const Task = require('../models/taskModel')
const Master = require('../models/masterModel')
const Status = Master.StatusModal;
const addtask = asyncHandler(async (req, res) => {
    try {
        await Task.create({
            Name: req.body.Name,
            Description: req.body.Description,
            Status: req.body.Status,
            Assign: req.body.Assign,
            Priority: req.body.Priority,
            StartDate: req.body.StartDate,
            EndDate: req.body.EndDate,
            is_active: true,
            addedBy: req.user._id
        });
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
        await Task.findByIdAndUpdate(req.body.id, {
            Name: req.body.Name,
            Description: req.body.Description,
            Status: req.body.Status,
            Assign: req.body.Assign,
            Priority: req.body.Priority,
            StartDate: req.body.StartDate,
            EndDate: req.body.EndDate,
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
    try {
        let taskList = await Task.find({ is_active: req.body.active, Assign: req.body.user }).populate("Status").populate("Assign")
            .sort({ createdAt: -1 })
        return res.status(200).json({
            success: true,
            data: taskList
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
    gettaskboardCount
}