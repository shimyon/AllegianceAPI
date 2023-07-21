const asyncHandler = require('express-async-handler')
const Template = require('../models/templateModel')

const add = asyncHandler(async (req, res) => {
    const { Name, TemplateFor, Detail } = req.body
    const templateExists = await Template.findOne({ Name:req.body.Name ,TemplateFor:req.body.TemplateFor})
    if (templateExists) {
        res.status(400)
        throw new Error('Template Already Exists!')
    }
    const Templateadd = await Template.create({
        Name,
        TemplateFor,
        Detail,
    })

    if (Templateadd) {
        res.status(201).json({
            _id: Templateadd.id,
            Name: Templateadd.Name,
            Detail: Templateadd.Detail,
            TemplateFor: Templateadd.TemplateFor,
        })
    }
    else {
        res.status(400)
        throw new Error("Invalid Template data!")
    }
})

const update = asyncHandler(async (req, res) => {
    const { id, Name, TemplateFor, Detail } = req.body

    if (!id) {
        res.status(400)
        throw new Error('Template id not found!')
    }

    const TemplateExists = await Template.findOne({ _id: id });
    if (!TemplateExists) {
        res.status(400)
        throw new Error('Template Not Found')
    }

    let template = await Template.findByIdAndUpdate(id, {
        Name: Name,
        TemplateFor: TemplateFor,
        Detail: Detail,
    });
    template = await Template.findOne({ _id: id });
    if (template) {
        res.status(201).json({
            _id: template.id,
            Name: template.Name,
            Detail: template.Detail,
            TemplateFor: template.TemplateFor,
        })
    }
    else {
        res.status(400)
        throw new Error("Invalid Template data!")
    }
})

const getById = asyncHandler(async (req, res) => {
    const { _id, TemplateFor, Name, Detail, is_default, is_active } = await Template.findById(req.params.id)

    res.status(200).json({
        id: _id,
        TemplateFor,
        Name,
        Detail,
        is_default,
        is_active
    })
})

const getAll = asyncHandler(async (req, res) => {
    try {
        const template = await Template.find({ is_active: req.body.active }, { _id: 1, TemplateFor: 1, Name: 1, Detail: 1, is_default: 1, is_active: 1 });

        res.status(200).json(template).end();
    } catch (err) {
        return res.status(400).json({
            success: false,
            msg: "Error in getting template. " + err.message,
            data: null,
        });
    }
})

const remove = asyncHandler(async (req, res) => {
    let active = req.body.active == true ? "enabled" : "disabled";
    try {
        const existTemplate = await Template.findById(req.params.id);
        if (!existTemplate) {
            return res.status(200).json({
                success: false,
                msg: "Template not found.",
                data: null,
            });
        }

        const newTemplate = await Template.findByIdAndUpdate(req.params.id, {
            is_active: req.body.active
        });

        return res.status(200).json({
            success: true,
            msg: "Template " + active,
            data: null
        }).end();
    } catch (err) {
        return res.status(400).json({
            success: false,
            msg: "Error in process. " + err.message,
            data: null,
        });
    }

});

const setDefault = asyncHandler(async (req, res) => {
    try {
        if (req.body.type == "Quotation") {
            await Template.updateMany({ "TemplateFor": req.body.type }, {
                is_default: false
            });
            await Template.findByIdAndUpdate(req.body.id, {
                is_default: req.body.default
            });
        }
        else if (req.body.type == "Order") {
            await Template.updateMany({ "TemplateFor": req.body.type }, {
                is_default: false
            });
            await Template.findByIdAndUpdate(req.body.id, {
                is_default: req.body.default
            });
        }
        else if (req.body.type == "Invoice") {
            await Template.updateMany({ "TemplateFor": req.body.type }, {
                is_default: false
            });
            await Template.findByIdAndUpdate(req.body.id, {
                is_default: req.body.default
            });
        }
        else{
            await Template.updateMany({ "TemplateFor": req.body.type }, {
                is_default: false
            });
            await Template.findByIdAndUpdate(req.body.id, {
                is_default: req.body.default
            });
        }
        return res.status(200).json({
            success: true,
            msg: "Default address set"
        });
    } catch (err) {
        return res.status(400).json({
            success: false,
            msg: "Error in removing Template. " + err.message,
            data: null,
        });
    }

});
module.exports = {
    add,
    getById,
    update,
    getAll,
    remove,
    setDefault
}