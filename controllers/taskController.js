const asyncHandler = require('express-async-handler')
const Task = require('../models/taskModel')
const addtask = asyncHandler(async (req, res) => {
    try {
        await Task.create({
            Name: req.body.Name,
            Description: req.body.Description,
            Status: req.body.Status,
            Assign: req.body.Assign,
            Priority: req.body.Priority,
            Date: req.body.Date,
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
            Date: req.body.Date,
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
        let taskList = await Task.find({ is_active: req.body.active ,Assign:req.body.user}).populate("Status").populate("Assign")
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


module.exports = {
    addtask,
    edittask,
    removetask,
    getAlltask,
    gettaskById,
}