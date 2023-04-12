const asyncHandler = require('express-async-handler')
const Lead = require('../models/leadModel')

const addLead = asyncHandler(async (req, res) => {
    try {
        const existLead= Lead.findOne({$or:[{Mobile:req.body.mobile,Email:req.body.email}]});
        if(existLead)
        {
            return res.status(200).json({
                success: false,
                msg: "Lead already exist with same mobile or email.",
                data: null,
            });
        }

        const newLead =await  Lead.create({
            Company:req.body.company,
            Title:req.body.title,
            FirstName:req.body.firstname,
            LastName:req.body.lastname,
            Designation:req.body.designation,
            Mobile:req.body.mobile,
            Email:req.body.email,
            City:req.body.city,
            State:req.body.state,
            Country:req.body.country,
            Source:req.body.source,
            Product:req.body.product,
            Requirements:req.body.requirements,
            Notes:req.body.notes,
            InCharge:req.body.incharge,
            LeadSince:req.body.leadSince,
            NextTalkon:req.body.nextTalkOn,
            NextTalkNotes:req.body.nextTalkNotes,
            is_active:true
        });

        return res.status(200).json(newLead).end();
    } catch (err) {
        return res.status(400).json({
            success: false,
            msg: "Error in creating Lead. " + err.message,
            data: null,
        });
    }

});

const editLead = asyncHandler(async (req, res) => {
    try {
        const existLead= Lead.findById(req.body.id);
        if(!existLead)
        {
            return res.status(200).json({
                success: false,
                msg: "Lead not found.",
                data: null,
            });
        }

        const newLead =await  Lead.findOneAndUpdate(req.body.id,{
            Company:req.body.company,
            Title:req.body.title,
            FirstName:req.body.firstname,
            LastName:req.body.lastname,
            Designation:req.body.designation,
            Mobile:req.body.mobile,
            Email:req.body.email,
            City:req.body.city,
            State:req.body.state,
            Country:req.body.country,
            Source:req.body.source,
            Product:req.body.product,
            Requirements:req.body.requirements,
            Notes:req.body.notes,
            InCharge:req.body.incharge,
            LeadSince:req.body.leadSince,
            NextTalkon:req.body.nextTalkOn,
            NextTalkNotes:req.body.nextTalkNotes
        });

        return res.status(200).json({
            success: false,
            msg: "Lead Updated. ",
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

const removeLead = asyncHandler(async (req, res) => {
    try {
        const existLead= Lead.findById(req.body.id);
        if(!existLead)
        {
            return res.status(200).json({
                success: false,
                msg: "Lead not found.",
                data: null,
            });
        }

        const newLead =await  Lead.findOneAndUpdate(req.body.id,{
            is_active:false
        });

        return res.status(200).json({
            success: false,
            msg: "Lead removed. ",
            data: null
        }).end();
    } catch (err) {
        return res.status(400).json({
            success: false,
            msg: "Error in removing lead. " + err.message,
            data: null,
        });
    }

});

module.exports = {
    addLead,
    editLead,
    removeLead
}