const asyncHandler = require('express-async-handler')
const ProspectModal = require('../models/prospectModel')
const Prospect = ProspectModal.ProspectsModal;
const Interaction = ProspectModal.ProInteractionModal;
const NextOn = ProspectModal.ProNextOnModal;
const ProspectOtherContactModal = ProspectModal.ProspectOtherContactModal;

const addProspect = asyncHandler(async (req, res) => {
    try {

        let prospect = await Prospect.create({
            Company: req.body.company,
            Title: req.body.title,
            FirstName: req.body.firstname,
            LastName: req.body.lastname,
            Mobile: req.body.mobile,
            Email: req.body.email,
            City: req.body.city,
            State: req.body.state,
            Country: req.body.country,
            Product: req.body.product,
            Notes: req.body.notes,
            ProspectAmount: req.body.prospectAmount,
            OrderTarget: req.body.orderTarget,
            Executive: req.body.executive,
            addedBy: req.user._id,
            Stage: req.body.stage,
            Requirements: req.body.requirements,
            Source: req.body.source,
            StageDate: new Date(),
            is_active: true
        });

        return res.status(200).json({
            success: true,
            msg: "Prospect added successfully",
        }).end();
    } catch (err) {
        return res.status(400).json({
            success: false,
            msg: "Error in adding interaction. " + err.message,
            data: null,
        });
    }

});

const editProspect = asyncHandler(async (req, res) => {
    try {
        const existProspect = await Prospect.findById(req.body.id);
        if (!existProspect) {
            return res.status(200).json({
                success: false,
                msg: "Prospect not found.",
                data: null,
            });
        }

        const newProspect = await Prospect.findByIdAndUpdate(req.body.id, {
            Company: req.body.company,
            Title: req.body.title,
            FirstName: req.body.firstname,
            LastName: req.body.lastname,
            Mobile: req.body.mobile,
            Email: req.body.email,
            City: req.body.city,
            State: req.body.state,
            Country: req.body.country,
            Product: req.body.product,
            Notes: req.body.notes,
            ProspectAmount: req.body.prospectAmount,
            OrderTarget: req.body.orderTarget,
            Executive: req.body.executive,
            addedBy: req.user._id,
            Stage: req.body.stage,
            Source: req.body.source,
            Requirements: req.body.requirements,
            StageDate: new Date(),
            is_active: true
        });

        return res.status(200).json({
            success: true,
            msg: "Prospect Updated. ",
            data: null
        }).end();
    } catch (err) {
        return res.status(400).json({
            success: false,
            msg: "Error in updating lead. " + err.message,
            data: null,
        });
    }

});

const removeProspect = asyncHandler(async (req, res) => {
    try {
        const existProspect = await Prospect.findById(req.body.id);
        if (!existProspect) {
            return res.status(200).json({
                success: false,
                msg: "Prospect not found.",
                data: null,
            });
        }

        const newProspect = await Prospect.findByIdAndUpdate(req.body.id, {
            is_active: false,
            RemoveReason: req.body.reason
        });

        return res.status(200).json({
            success: true,
            msg: "Prospect removed. ",
            data: null
        }).end();
    } catch (err) {
        return res.status(400).json({
            success: false,
            msg: "Error in removing Prospect. " + err.message,
            data: null,
        });
    }

});

const getAllProspect = asyncHandler(async (req, res) => {
    try {
        let prospectList = await Prospect.find({ is_active: true }).populate({
            path: "Interaction",
            populate: {
                path: "user",
                select: "_id name email role"
            }
        }).populate(
            {
                path: "NextTalk",
                populate: {
                    path: "user",
                    select: "_id name email role"
                }
            }).populate("Product").populate("OtherContact").populate("Executive").populate("Source").populate("addedBy", "_id name email role")
        return res.status(200).json({
            success: true,
            data: prospectList
        }).end();
    } catch (err) {
        return res.status(400).json({
            success: false,
            msg: "Error in getting prospect. " + err.message,
            data: null,
        });
    }

});

const getProspectById = asyncHandler(async (req, res) => {
    try {
        let prospectList = await Prospect.find({ _id: req.params.id }).populate({
            path: "Interaction",
            populate: {
                path: "user",
                select: "_id name email role"
            }
        }).populate(
            {
                path: "NextTalk",
                populate: {
                    path: "user",
                    select: "_id name email role"
                }
            }).populate("Product").populate("OtherContact").populate("Executive").populate("Source").populate("addedBy", "_id name email role")
        return res.status(200).json({
            success: true,
            data: prospectList
        }).end();
    } catch (err) {
        return res.status(400).json({
            success: false,
            msg: "Error in getting lead. " + err.message,
            data: null,
        });
    }

});

const changeProspectStage = asyncHandler(async (req, res) => {
    try {
        await Prospect.findByIdAndUpdate(req.body.id, {
            Stage: req.body.stage,
            StageDate: new Date()
        });
        return res.status(200).json({
            success: true,
            msg: "Stage Changed",
        }).end();
    } catch (err) {
        return res.status(400).json({
            success: false,
            msg: "Error in process" + err.message,
            data: null,
        });
    }

});

const addNext = asyncHandler(async (req, res) => {
    try {
        let nextOn = await NextOn.create({
            leadId: req.body.id,
            date: req.body.date,
            note: req.body.note,
            user: req.user._id
        });

        let leadExisting = await Prospect.findByIdAndUpdate(req.body.id, {
            NextTalk: nextOn._id
        });
        return res.status(200).json({
            success: true,
            msg: "Data added successfully",
        }).end();
    } catch (err) {
        return res.status(400).json({
            success: false,
            msg: "Error in adding data. " + err.message,
            data: null,
        });
    }

});

const addInteraction = asyncHandler(async (req, res) => {
    try {
        let interaction = await Interaction.create({
            leadId: req.body.id,
            date: req.body.date,
            note: req.body.note,
            user: req.user._id
        });

        let leadExisting = await Prospect.findByIdAndUpdate(req.body.id, {
            Interaction: interaction._id
        });
        return res.status(200).json({
            success: true,
            msg: "Data added successfully",
        }).end();
    } catch (err) {
        return res.status(400).json({
            success: false,
            msg: "Error in adding data. " + err.message,
            data: null,
        });
    }

});

const addOtherContact = asyncHandler(async (req, res) => {
    try {
        let prospectExist = await Prospect.findById(req.body.id);
        let nextOn = await ProspectOtherContactModal.create({
            ProspectId: req.body.id,
            Name: req.body.name,
            Mobile: req.body.mobile,
            Email: req.body.email
        });

        prospectExist.OtherContact.push(nextOn);
        prospectExist.save((err) => {
            if (err) throw err;
        });
        return res.status(200).json({
            success: true,
            msg: "Contact added successfully",
        }).end();
    } catch (err) {
        return res.status(400).json({
            success: false,
            msg: "Error in adding contact. " + err.message
        });
    }

});

const getOtherContact = asyncHandler(async (req, res) => {
    try {
        let otherContact = await ProspectOtherContactModal.find({ LeadId: req.params.id });
        return res.status(200).json({
            success: true,
            msg: "Success",
            data: otherContact
        }).end();
    } catch (err) {
        return res.status(400).json({
            success: false,
            msg: "Error in getting data. " + err.message
        });
    }
})

module.exports = {
    addProspect,
    editProspect,
    getAllProspect,
    getProspectById,
    addNext,
    addInteraction,
    removeProspect,
    changeProspectStage,
    addOtherContact,
    getOtherContact
}