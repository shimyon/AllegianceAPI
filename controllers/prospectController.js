const asyncHandler = require('express-async-handler')
const ProspectModal = require('../models/prospectModel')
const User = require('../models/userModel')
const notificationModel = require('../models/notificationModel')
const Prospect = ProspectModal.ProspectsModal;
const NextOn = ProspectModal.ProNextOnModal;
const ProspectOtherContactModal = ProspectModal.ProspectOtherContactModal;
const uploadFile = require("../middleware/uploadFileMiddleware");
const path = require("path");
const readXlsxFile = require('read-excel-file/node')
const Master = require('../models/masterModel')
const Product = Master.ProductModal;
const Source = Master.SourceModal;
const CustomerModal = require('../models/customerModel')
const Customer = CustomerModal.CustomerModal

const addProspect = asyncHandler(async (req, res) => {
    try {

        let prospect = await Prospect.create({
            Company: req.body.company,
            Title: req.body.title,
            FirstName: req.body.firstname,
            LastName: req.body.lastname,
            Mobile: req.body.mobile,
            Email: req.body.email,
            Website: req.body.website,
            City: req.body.city,
            State: req.body.state,
            Country: req.body.country,
            Product: req.body.product,
            Notes: req.body.notes,
            ProspectAmount: req.body.prospectAmount,
            OrderTarget: req.body.orderTarget,
            Sales: req.body.sales,
            addedBy: req.user._id,
            Stage: req.body.stage,
            Requirements: req.body.requirements,
            Source: req.body.source,
            StageDate: new Date(),
            is_active: true
        });
        if (prospect) {
            let resuser = await User.find({ is_active: true, role: 'Admin' });
            let date = new Date();
            const savedNotification = await notificationModel.create({
                description: `Prospect(${req.body.company}) entry has been created`,
                date: date,
                userId: prospect.Sales,
                Isread: false
            });
            let insertdata = resuser.map(f => ({
                description: `Prospect(${req.body.company}) entry has been created`,
                date: date,
                userId: f._id,
                Isread: false
            }));
            if (insertdata.length > 0) {
                const savedNotification = await notificationModel.insertMany(insertdata);
            }

            return res.status(200).json(prospect).end();
        }
        else {
            res.status(400)
            throw new Error("Invalid Prospect data!")
        }
    } catch (err) {
        return res.status(400).json({
            success: false,
            msg: "Error in adding Prospect. " + err.message,
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
            Website: req.body.website,
            City: req.body.city,
            State: req.body.state,
            Country: req.body.country,
            Product: req.body.product,
            Notes: req.body.notes,
            ProspectAmount: req.body.prospectAmount,
            OrderTarget: req.body.orderTarget,
            Sales: req.body.sales,
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
        var condition = { is_active: req.body.active };
        var cDate = new Date();
        if (req.body.sales) {
            condition.Sales = req.body.sales;
        }
        if (req.body.source) {
            condition.Source = req.body.source;
        }
        //unread prospect
        if (req.body.unread == true) {
            condition.is_readed = false;
        }
        if (req.body.leadSince) {
            cDate.setDate(cDate.getDate() - req.body.leadSince);
            condition.createdAt = { $gte: cDate };
        }
        if (req.body.appointment == "notset") {
            condition.NextTalk = null;
        }
        else if (req.body.appointment != "all") {
            condition.NextTalk = { $ne: null };
        }

        let prospectList = await Prospect.find(condition).populate(
            {
                path: "NextTalk",
                populate: {
                    path: "user",
                    select: "_id name email role"
                }
            }).populate("Product").populate("OtherContact").populate("Sales").populate("Source").populate("addedBy", "_id name email role")
            .exec((err, result) => {
                if (err) {
                    return res.status(400).json({
                        success: false,
                        msg: "Error in getting prospect. " + err,
                    });
                }
                var newResult = [];
                result.forEach((val, idx) => {
                    var addData = true;
                    if (req.body.appointment != "notset" && req.body.appointment != "all") {
                        if (val.NextTalk) {
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
                    //followup condition
                    if (req.body.followup) {
                        var fDate = new Date(req.body.followup);
                        if (val.NextTalk == null) {
                            addData = false;
                        } else {
                            console.log(val.NextTalk.date + " " + fDate);
                            if (val.NextTalk.date.toDateString() !== fDate.toDateString()) {
                                addData = false;
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
            msg: "Error in getting prospect. " + err.message,
        });
    }

});

const getProspectById = asyncHandler(async (req, res) => {
    try {
        let prospectList = await Prospect.find({ _id: req.params.id }).populate(
            {
                path: "NextTalk",
                populate: {
                    path: "user",
                    select: "_id name email role"
                }
            }).populate("Product").populate("OtherContact").populate("Sales").populate("Source").populate("addedBy", "_id name email role")
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
        let prospect = await Prospect.findByIdAndUpdate(req.body.id, {
            Stage: req.body.stage,
            StageDate: new Date()
        });
        
        if (prospect) {
            let resuser = await User.find({ is_active: true, role: 'Admin' });
            let date = new Date();
            // const savedNotification = await notificationModel.create({
            //     description: `Prospect(${prospect.Stage}) entry has been created`,
            //     date: date,
            //     userId: prospect.Sales,
            //     Isread: false
            // });
            let insertdata = resuser.map(f => ({
                description: `Prospect(${req.body.id}) move to ${req.body.stage} stage.`,
                date: date,
                userId: f._id,
                Isread: false
            }));
            if (insertdata.length > 0) {
                const savedNotification = await notificationModel.insertMany(insertdata);
            }

            return res.status(200).json(prospect).end();
        }
        else {
            res.status(400)
            throw new Error("Invalid Prospect data!")
        }
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
            prospectId: req.body.id,
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
const getNext = asyncHandler(async (req, res) => {
    try {
        const next = await NextOn.find({ prospectId: req.params.id }).sort({ date: -1 }).populate("user");

        res.status(200).json({
            success: true,
            msg: "",
            data: next,
        }).end();
    } catch (err) {
        return res.status(400).json({
            success: false,
            msg: "Error in getting status. " + err.message,
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
        let otherContact = await ProspectOtherContactModal.find({ ProspectId: req.params.id });
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

const importExcel = asyncHandler(async (req, res) => {
    try {
        process.env.UPLOADFILE = "";
        await uploadFile(req, res, function (err) {
            if (err) {
                return ("Error uploading file.");
            } else {
                importFiletoDB(req, res, process.env.UPLOADFILE)
            }
        })

    } catch (err) {
        return res.status(400).json({
            success: false,
            msg: "Error in importing data. " + err.message,
            data: null,
        });

    }
})

const importFiletoDB = asyncHandler(async (req, res, fileName) => {
    try {
        var exFile = path.join(process.env.UPLOAD_FOLDER, "uploads", fileName.replace(",", ""));
        var importData = [];

        await readXlsxFile(exFile).then(async (rows) => {
            var msg = "";
            for (var idx = 0; idx < rows.length; idx++) {
                var val = rows[idx];
                var sourceId = {};
                var productId = {};
                sourceId._id = null;
                productId._id = null;
                if (idx != 0) {
                    if (val[18] != "" && val[18] != null) {
                        sourceId = await Source.findOne({ Name: { $regex: val[18], $options: 'i' } }, { _id: 1 });
                        if (!sourceId) {
                            return res.status(400).json({
                                success: true,
                                msg: val[10] + " source not found. ",
                                data: null,
                            });
                        }
                    }

                    if (val[15] != "" && val[15] != null) {
                        productId = await Product.findOne({ Name: { $regex: val[15], $options: 'i' } }, { _id: 1 });
                        if (!productId) {
                            return res.status(400).json({
                                success: true,
                                msg: val[11] + " product not found. ",
                                data: null,
                            });


                        }
                    }
                    importData.push({
                        Company: val[0],
                        CompanyCode: val[1],
                        Title: val[2],
                        FirstName: val[3],
                        LastName: val[4],
                        Mobile: val[5],
                        Email: val[6],
                        Stage: "New",
                        Website: val[9],
                        Industry: val[10],
                        Segment: val[11],
                        Country: val[12],
                        State: val[13],
                        City: val[14],
                        Source: sourceId._id,
                        Product: productId._id,
                        ProspectAmount: val[16],
                        Notes: val[17],
                        addedBy: req.user._id,
                        LeadSince: new Date(),
                        StageDate: new Date(),
                        is_active: true
                    });
                }
            }

            const newLead = await Prospect.create(importData);
            return res.status(200).json({
                success: true,
                msg: "Data imported successfully. ",
                data: null,
            });

        });

    } catch (err) {
        return res.status(400).json({
            success: false,
            msg: "Error in importing data. " + err.message,
            data: null,
        });


    }
})

const convertToCustomer = asyncHandler(async (req, res) => {
    try {
        var pros = await Prospect.findById(req.params.id);

        const existCustomer = await Customer.findOne({ $or: [{ Mobile: pros.Mobile, Email: pros.Email }] });
        if (existCustomer) {
            return res.status(200).json({
                success: false,
                msg: "Customer already exist with same mobile or email.",
                data: null,
            });
        }

        const newCustomer = await Customer.create({
            Company: pros.Company,
            Title: pros.Title,
            FirstName: pros.FirstName,
            LastName: pros.LastName,
            Mobile: pros.Mobile,
            Email: pros.Email,
            City: pros.City,
            State: pros.State,
            Country: pros.Country,
            addedBy: req.user._id,
            Notes: pros.Notes,
            is_active: true
        });

        return res.status(200).json(newCustomer).end();
    } catch (err) {
        return res.status(400).json({
            success: false,
            msg: "Error in creating Customer. " + err.message,
            data: null,
        });
    }

});

const markAsRead = asyncHandler(async (req, res) => {
    try {
        await Prospect.findByIdAndUpdate(req.params.id, {
            is_readed: true
        })
        return res.status(200).json({
            success: true,
            msg: "Marked as read",
        }).end();
    } catch (err) {
        return res.status(400).json({
            success: false,
            msg: "Error in process. " + err.message
        });
    }

});

module.exports = {
    addProspect,
    editProspect,
    getAllProspect,
    getProspectById,
    addNext,
    getNext,
    removeProspect,
    changeProspectStage,
    addOtherContact,
    getOtherContact,
    importExcel,
    convertToCustomer,
    markAsRead
}