const asyncHandler = require('express-async-handler')
const moduleRight = require('../models/moduleRightModel');
const { ModuleModal } = require('../models/masterModel');

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
            });
            if (newmoduleRight) {
                AddGroupRight(req)
            }
            return res.status(200).json(newmoduleRight).end();
        }
        else {
            const newmoduleRight = await moduleRight.create({
                role: req.body.role,
                moduleId: req.body.moduleId,
                read: req.body.read,
                write: req.body.write,
                delete: req.body.delete,
            });
            if (newmoduleRight) {
                AddGroupRight(req)
            }
            return res.status(200).json(newmoduleRight).end();
        }
    } catch (err) {
        return res.status(400).json({
            success: false,
            msg: "Error in adding moduleRight. " + err.message
        });
    }
})
const AddGroupRight = asyncHandler(async (req, res) => {
    try {
        let oldgroupModule = 0;
        let oldroleModule = await ModuleModal.findOne({ Name: req.body.groupname });
        let oldgrouprole1Module = await moduleRight.findOne({ role: req.body.role, moduleId: oldroleModule.id });

        let oldgrouproleModule = await moduleRight.find({ role: req.body.role }).populate("moduleId");
        oldgrouproleModule.forEach(element => {
            if (element.moduleId?.GroupName == req.body.groupname) {
                if (element.read == true) {
                    oldgroupModule += 1;
                }
            }
        });
        if (oldgroupModule == 0) {
            let newgroupmoduleRight = await moduleRight.findByIdAndUpdate(oldgrouprole1Module.id, {
                role: req.body.role,
                moduleId: oldroleModule.id,
                read: false
            });
        }
        else {
            let newgroupmoduleRight = await moduleRight.findByIdAndUpdate(oldgrouprole1Module.id, {
                role: req.body.role,
                moduleId: oldroleModule.id,
                read: true
            });
        }
    } catch (err) {
    }
})
const GetModuleRightByRole = asyncHandler(async (req, res) => {
    try {
        let modules = await ModuleModal.find({}).lean();
        let moduleRightList = await moduleRight.find({ role: req.params.role }).lean();
        let modulerights = [];
        for (const key in modules) {
            if (Object.hasOwnProperty.call(modules, key)) {
                const element = modules[key];
                let right = {
                    modulename: element.Name,
                    read: false,
                    write: false,
                    delete: false,
                };
                let rightmap = moduleRightList.find(f => f.moduleId.toString() == element._id.toString());
                if (rightmap) {
                    right.read = rightmap.read;
                    right.write = rightmap.write;
                    right.delete = rightmap.delete;
                }
                modulerights.push(right);
            }
        }
        return res.status(200).json({
            success: true,
            data: modulerights
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