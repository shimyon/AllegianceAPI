const asyncHandler = require('express-async-handler')
const LeadModal = require('../models/leadModel')
const Lead = LeadModal.LeadsModal;
const Interaction = LeadModal.InteractionModal;
const NextOn = LeadModal.NextOnModal;

const addLead = asyncHandler(async (req, res) => {
    try {
        const existLead = await Lead.findOne({ $or: [{ Mobile: req.body.mobile, Email: req.body.email }] });
        if (existLead) {
            return res.status(200).json({
                success: false,
                msg: "Lead already exist with same mobile or email.",
                data: null,
            });
        }
        const newLead = await Lead.create({
            Company: req.body.company,
            Title: req.body.title,
            FirstName: req.body.firstname,
            LastName: req.body.lastname,
            Designation: req.body.designation,
            Mobile: req.body.mobile,
            Email: req.body.email,
            City: req.body.city,
            State: req.body.state,
            Country: req.body.country,
            Source: req.body.source,
            Product: req.body.product,
            Requirements: req.body.requirements,
            Notes: req.body.notes,
            InCharge: req.body.incharge,
            NextTalkon: req.body.nextTalkOn,
            NextTalkNotes: req.body.nextTalkNotes,
            addedBy: req.cookies["userid"],
            Stage: "New",
            LeadSince: new Date(),
            StageDate: new Date(),
            is_active: true
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
        const existLead = Lead.findById(req.body.id);
        if (!existLead) {
            return res.status(200).json({
                success: false,
                msg: "Lead not found.",
                data: null,
            });
        }

        const newLead = await Lead.findOneAndUpdate(req.body.id, {
            Company: req.body.company,
            Title: req.body.title,
            FirstName: req.body.firstname,
            LastName: req.body.lastname,
            Designation: req.body.designation,
            Mobile: req.body.mobile,
            Email: req.body.email,
            City: req.body.city,
            State: req.body.state,
            Country: req.body.country,
            Source: req.body.source,
            Product: req.body.product,
            Requirements: req.body.requirements,
            Notes: req.body.notes,
            InCharge: req.body.incharge,
            is_active: true
        });

        return res.status(200).json({
            success: true,
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
        const existLead = Lead.findById(req.params.id);
        if (!existLead) {
            return res.status(200).json({
                success: false,
                msg: "Lead not found.",
                data: null,
            });
        }

        const newLead = await Lead.findOneAndUpdate(req.params.id, {
            is_active: false
        });

        return res.status(200).json({
            success: true,
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

const getAllLead = asyncHandler(async (req, res) => {
    var condition = { is_active: true, Stage: "New" };

    if (req.body.source) {
        condition.Source = req.body.source;
    }

    if (req.body.executive) {
        condition.Executive = req.body.executive;
    }

    if (req.body.product) {
        condition.Product = req.body.product;
    }

    if (req.body.appointment == "notset") {
        condition.NextTalk = null;
    }

    if (req.body.month) {
        if (req.body.month == "this") {
            const currentMonth = new Date().getMonth() + 1;
            condition.$expr = {
                $eq: [{ $month: "$LeadSince" }, currentMonth]
            };
        }
        if (req.body.month == "last") {
            const currentMonth = new Date().getMonth();
            condition.$expr = {
                $eq: [{ $month: "$LeadSince" }, currentMonth]
            };
        }
    }

    if (req.body.monthyear) {
        var my = req.body.monthyear.split("-");
        condition.$expr = {
            $and: [{
                $eq: [{ $year: "$LeadSince" }, my[1]],
                $eq: [{ $month: "$LeadSince" }, my[0]]
            }]
        };

    }

    if (req.body.financeyear) {
        var my = req.body.financeyear.split("-");
        var fDate = new Date(my[0] + "-04-" + "01");
        var tDate = new Date(my[1] + "-03-" + "31");;

        condition.LeadSince = { $gte: fDate, $lt: tDate };

    }

    try {
        let leadList = await Lead.find(condition).populate("Source").populate("Product").populate("Executive").populate("Interaction").populate("NextTalk").populate("addedBy")
            .exec((err, result) => {
                var newResult = [];
                result.forEach((val, idx) => {
                    var addData = true;
                    if (req.body.appointment) {
                        if (val.NextTalk.date) {
                            let dt = new Date();
                            let nDate = new Date();
                            nDate.setDate(nDate.getDate() + 1);
                            let apptDate = new Date(val.NextTalk.date);
                            let cDt = new Date(dt.toDateString());
                            let aDate = new Date(apptDate.toDateString());
                            let nDt = new Date(nDate.toDateString());
                            addData = false;
                            if (req.body.appointment == "overdue" && cDt > aDate) {
                                addData = true;
                            }

                            if (req.body.appointment == "today" && dt.toDateString() == apptDate.toDateString()) {
                                addData = true;
                            }

                            if (req.body.appointment == "tomorrow" && nDate.toDateString() == apptDate.toDateString()) {
                                addData = true;
                            }

                            if (req.body.appointment == "future" && aDate > nDate) {
                                addData = true;
                            }
                        }
                    }
                    if (addData) {
                        newResult.push(val);

                    }
                })
                return res.status(200).json({
                    success: true,
                    data: newResult
                }).end();

            })
    } catch (err) {
        return res.status(400).json({
            success: false,
            msg: "Error in getting lead. " + err.message,
            data: null,
        });
    }

});

const getLeadById = asyncHandler(async (req, res) => {
    try {
        let leadList = await Lead.find({ is_active: true, Stage: "New", _id: req.params.id }).populate("Source").populate("Product").populate("Executive").populate("Interaction").populate("NextTalk").populate("addedBy")
        return res.status(200).json({
            success: true,
            data: leadList
        }).end();
    } catch (err) {
        return res.status(400).json({
            success: false,
            msg: "Error in getting lead. " + err.message,
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
            user: req.cookies["userid"]
        });

        let leadExisting = await Lead.findByIdAndUpdate(req.body.id, {
            Interaction: interaction._id
        });
        return res.status(200).json({
            success: true,
            msg: "Interaction added successfully",
        }).end();
    } catch (err) {
        return res.status(400).json({
            success: false,
            msg: "Error in adding interaction. " + err.message,
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
            user: req.cookies["userid"]
        });

        let leadExisting = await Lead.findByIdAndUpdate(req.body.id, {
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

const assignExecutive = asyncHandler(async (req, res) => {
    try {
        let leadExisting = await Lead.findByIdAndUpdate(req.body.id, {
            Executive: req.body.executive
        });
        return res.status(200).json({
            success: true,
            msg: "Executive assigned successfully",
        }).end();
    } catch (err) {
        return res.status(400).json({
            success: false,
            msg: "Error in adding data. " + err.message,
            data: null,
        });
    }

});

const moveToProspect = asyncHandler(async (req, res) => {
    try {
        let leadExisting = await Lead.findByIdAndUpdate(req.params.id, {
            Stage: "Prospect",
            StageDate: new Date()
        });
        return res.status(200).json({
            success: true,
            msg: "Moved to prospect successfully",
        }).end();
    } catch (err) {
        return res.status(400).json({
            success: false,
            msg: "Error in moving. " + err.message,
            data: null,
        });
    }

});

module.exports = {
    addLead,
    editLead,
    removeLead,
    getAllLead,
    getLeadById,
    addInteraction,
    addNext,
    assignExecutive,
    moveToProspect
}