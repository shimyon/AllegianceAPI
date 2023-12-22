const asyncHandler = require('express-async-handler')
const moduleRight = require('../models/moduleRightModel')

const AddModuleRight = asyncHandler(async (req, res) => {
    try {
        let oldModule = await moduleRight.findOne({ role: req.body.role, moduleId: req.body.moduleId });

        if (oldModule) {
            let newmoduleRight = await moduleRight.findByIdAndUpdate(oldModule.id, {
                role: req.body.role,
                moduleId: req.body.moduleId,
                read: req.body.read,
                write: req.body.write,
                delete: req.body.delete,
                all: req.body.all,
            });
            return res.status(200).json(newmoduleRight).end();
        }
        else {
            const newmoduleRight = await moduleRight.create({
                role: req.body.role,
                moduleId: req.body.moduleId,
                read: req.body.read,
                write: req.body.write,
                delete: req.body.delete,
                all: req.body.all,
            });
            return res.status(200).json(newmoduleRight).end();
        }
    } catch (err) {
        return res.status(400).json({
            success: false,
            msg: "Error in adding moduleRight. " + err.message
        });
    }
})

const GetModuleRightByRole = asyncHandler(async (req, res) => {
    try {
        let moduleRightList = await moduleRight.find({role:req.params.role}).populate("moduleId")
        return res.status(200).json({
            success: true,
            data: moduleRightList
        }).end();
    } catch (err) {
        return res.status(400).json({
            success: false,
            msg: "Error in getting moduleRight. " + err.message,
            data: null,
        });
    }

});



module.exports = {
    AddModuleRight,
    GetModuleRightByRole,
}