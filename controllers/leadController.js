const asyncHandler = require('express-async-handler')
const { ObjectId } = require('mongodb');
const LeadModal = require('../models/leadModel')
const User = require('../models/userModel')
const notificationModel = require('../models/notificationModel')
const Lead = LeadModal.LeadsModal;
const NextOn = LeadModal.NextOnModal;
const LeadOtherContact = LeadModal.LeadOtherContact;
const Master = require('../models/masterModel')
const Product = Master.ProductModal;
const Source = Master.SourceModal;
const ProspectModal = require('../models/prospectModel')
const Prospect = ProspectModal.ProspectsModal;
const uploadFile = require("../middleware/uploadFileMiddleware");
const readXlsxFile = require('read-excel-file/node')
const path = require("path");

const addLead = asyncHandler(async (req, res) => {
    try {
        const newLead = await Lead.create({
            Company: req.body.company,
            Title: req.body.title,
            GSTNo: req.body.gstno,
            FirstName: req.body.firstname,
            LastName: req.body.lastname,
            Designation: req.body.designation,
            Mobile: req.body.mobile,
            Email: req.body.email,
            City: req.body.city,
            State: req.body.state,
            Country: req.body.country,
            Source: req.body.source||null,
            Product: req.body.product||null,
            Requirements: req.body.requirements,
            Notes: req.body.notes,
            InCharge: req.body.incharge,
            NextTalkon: req.body.nextTalkOn,
            NextTalkNotes: req.body.nextTalkNotes,
            Sales: req.body.sales||null,
            addedBy: req.user._id,
            Stage: "New",
            LeadSince: new Date(),
            StageDate: new Date(),
            is_active: true
        });
        if (newLead) {
            let date = new Date();
            const savedNotification = await notificationModel.create({
                description: `lead(${req.body.company}) entry has been created`,
                date: date,
                userId: newLead.Sales,
                Isread: false
            });
            // let resuser = await User.find({ is_active: true, role: 'SuperAdmin' });
            // let insertdata = resuser.map(f => ({
            //     description: `lead(${req.body.company}) entry has been created`,
            //     date: date,
            //     userId: f._id,
            //     Isread: false
            // }));
            // if (insertdata.length > 0) {
            //     const savedNotification = await notificationModel.insertMany(insertdata);
            // }
            return res.status(200).json(newLead).end();
        }
        else {
            res.status(400)
            throw new Error("Invalid Lead data!")
        }
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
        const existLead = await Lead.findById(req.body.id);
        if (!existLead) {
            return res.status(200).json({
                success: false,
                msg: "Lead not found.",
                data: null,
            });
        }

        const newLead = await Lead.findByIdAndUpdate(req.body.id, {
            Company: req.body.company,
            Title: req.body.title,
            GSTNo: req.body.gstno,
            FirstName: req.body.firstname,
            LastName: req.body.lastname,
            Designation: req.body.designation,
            Mobile: req.body.mobile,
            Email: req.body.email,
            City: req.body.city,
            State: req.body.state,
            Country: req.body.country,
            Source: req.body.source||null,
            Product: req.body.product||null,
            Requirements: req.body.requirements,
            Sales: req.body.sales||null,
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
        const existLead = await Lead.findById(req.body.id);
        if (!existLead) {
            return res.status(200).json({
                success: false,
                msg: "Lead not found.",
                data: null,
            });
        }

        const newLead = await Lead.findByIdAndUpdate(req.body.id, {
            is_active: req.body.active,
            RemoveReason: req.body.reason
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
    try {
        let { skip, per_page } = req.body;
        let query = [];
        query.push({
            $match: { is_active: req.body.active, Stage: "New" }
        });
        if (req.body.filter) {
            query.push(
                {
                    $match: { Company: { $regex: new RegExp(req.body.filter, "i") } },
                });
        }
        if (req.body.favorite) {
            query.push({
                $match: { is_favorite: true }
            });
        }

        if (req.body.source) {
            query.push({
                $match: { Source: ObjectId(req.body.source) }
            });
        }

        if (req.body.sales) {
            query.push({
                $match: { Sales: ObjectId(req.body.sales) }
            });
        }

        if (req.body.product) {
            query.push({
                $match: { Product: ObjectId(req.body.product) }
            });
        }
        query.push(
            {
                '$lookup': {
                    'from': 'products',
                    'localField': 'Product',
                    'foreignField': '_id',
                    'as': 'Product'
                }
            },
            {
                $unwind: {
                    path: '$Product',
                    preserveNullAndEmptyArrays: true
                },
            },
            {
                $sort: { createdAt: -1 }
            }
        );
        if (req.body.month) {
            if (req.body.month == "this") {
                const currentMonth = new Date().getMonth() + 1;
                query.push({
                    $match: {
                        $expr: {
                            $eq: [{ $month: "$LeadSince" }, currentMonth]
                        }
                    }
                });
            }
            if (req.body.month == "last") {
                let currentMonth = new Date().getMonth();
                if (currentMonth == 0) {
                    currentMonth = currentMonth + 12;
                }
                query.push({
                    $match: {
                        $expr: {
                            $eq: [{ $month: "$LeadSince" }, currentMonth]
                        }
                    }
                });
            }
        }
        query.push(
            {
                $facet: {
                    stage1: [
                        {
                            $group: {
                                _id: null,
                                count: {
                                    $sum: 1,
                                },
                            },
                        },
                    ],
                    stage2: [
                        {
                            $skip: skip,
                        },
                        {
                            $limit: per_page,
                        },
                    ],
                },
            },
            {
                $unwind: {
                    path: '$stage1'
                },
            },
            {
                $project: {
                    count: "$stage1.count",
                    data: "$stage2",
                },
            }
        )
        const leadList = await Lead.aggregate(query).exec();
        if (leadList.length == 0) {
            return res.status(200).json({
                success: true,
                data: { Count: 0, data: [] }
            }).end();
        }
        else {
            return res.status(200).json({
                success: true,
                data: leadList[0]
            }).end();
        }
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
        let leadList = await Lead.find({ Stage: "New", _id: req.params.id }).populate("Source").populate("OtherContact").populate("Product").populate("Sales").populate("NextTalk").populate("addedBy")
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

const addNext = asyncHandler(async (req, res) => {
    try {
        let nextOn = await NextOn.create({
            leadId: req.body.leadid,
            date: req.body.date,
            note: req.body.note,
            user: req.user._id
        });

        let leadExisting = await Lead.findByIdAndUpdate(req.body.leadid, {
            NextTalk: nextOn._id
        });
        if (nextOn) {
            return res.status(200).json({
                success: true,
                msg: "Data added successfully",
            }).end();
        }
        else {
            res.status(400)
            throw new Error("Invalid data!")
        }
    } catch (err) {
        return res.status(400).json({
            success: false,
            msg: "Error in adding data. " + err.message,
            data: null,
        });
    }

});
const editNext = asyncHandler(async (req, res) => {
    try {
        let nextOn = await NextOn.findByIdAndUpdate(req.body.id, {
            date: req.body.date,
            note: req.body.note,
            user: req.user._id
        });

        if (nextOn) {
            return res.status(200).json({
                success: true,
                msg: "Next Action edited successfully",
            }).end();
        }
        else {
            res.status(400)
            throw new Error("Invalid data!")
        }
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
        const next = await NextOn.find({ leadId: req.params.id }).sort({ date: -1 }).populate("user");

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
        let leadExist = await Lead.findById(req.body.id);
        let nextOn = await LeadOtherContact.create({
            LeadId: req.body.id,
            Name: req.body.name,
            Mobile: req.body.mobile,
            Email: req.body.email
        });

        leadExist.OtherContact.push(nextOn);
        leadExist.save((err) => {
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
        let otherContact = await LeadOtherContact.find({ LeadId: req.params.id });
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

const moveToProspect = asyncHandler(async (req, res) => {
    try {
        let leadExisting = await Lead.findById(req.params.id);
        if (leadExisting.Stage == "Prospect") {
            return res.status(400).json({
                success: false,
                msg: "Lead already moved to prospect. "
            });
        }

        await Lead.findByIdAndUpdate(req.params.id, {
            Stage: "Prospect",
            ProspectStage: "New",
            StageDate: new Date()
        });
        let interaction = await Prospect.create({
            Company: leadExisting.Company,
            Title: leadExisting.Title,
            GSTNo: leadExisting.GSTNo,
            FirstName: leadExisting.FirstName,
            LastName: leadExisting.LastName,
            Mobile: leadExisting.Mobile,
            Email: leadExisting.Email,
            City: leadExisting.City,
            State: leadExisting.State,
            Country: leadExisting.Country,
            Product: leadExisting.Product,
            Notes: leadExisting.Notes,
            Sales: leadExisting.Sales,
            Source: leadExisting.Source,
            Requirements: leadExisting.Requirements,
            addedBy: req.user._id,
            Stage: "New",
            StageDate: new Date(),
            is_active: true
        });
        if (interaction) {
            let date = new Date();
            const savedNotification = await notificationModel.create({
                description: `lead(${interaction.Company}) Moved to prospect`,
                date: date,
                userId: interaction.Sales._id,
                Isread: false
            });
            // let resuser = await User.find({ is_active: true, role: 'SuperAdmin' });
            // let insertdata = resuser.map(f => ({
            //     description: `lead(${interaction.Company}) Moved to prospect`,
            //     date: date,
            //     userId: f._id,
            //     Isread: false
            // }));
            // if (insertdata.length > 0) {
            //     const savedNotification = await notificationModel.insertMany(insertdata);
            // }
            return res.status(200).json(interaction).end();
        }
        else {
            res.status(400)
            throw new Error("Invalid Lead data!")
        }
    } catch (err) {
        return res.status(400).json({
            success: false,
            msg: "Error in moving. " + err.message,
            data: null,
        });
    }

});

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
                if (idx != 0) {
                    var sourceId = await Source.findOne({ Name: { $regex: val[10], $options: 'i' } }, { _id: 1 });
                    if (!sourceId) {
                        return res.status(400).json({
                            success: true,
                            msg: val[10] + " source not found. ",
                            data: null,
                        });
                    }
                    var productId = await Product.findOne({ Name: { $regex: val[11], $options: 'i' } }, { _id: 1 });
                    if (!productId) {
                        return res.status(400).json({
                            success: true,
                            msg: val[11] + " product not found. ",
                            data: null,
                        });


                    }
                    importData.push({
                        Company: val[0],
                        Title: val[1],
                        FirstName: val[2],
                        LastName: val[3],
                        Designation: val[4],
                        Mobile: val[5],
                        Email: val[6],
                        City: val[7],
                        State: val[8],
                        Country: val[9],
                        Source: sourceId._id,
                        Product: productId._id,
                        Requirements: val[12],
                        Notes: val[13],
                        InCharge: val[14],
                        NextTalkon: val[16],
                        NextTalkNotes: val[17],
                        addedBy: req.user._id,
                        Stage: "New",
                        LeadSince: new Date(),
                        StageDate: new Date(),
                        is_active: true
                    });
                }
            }

            const newLead = await Lead.create(importData);
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

const setAsFavorite = asyncHandler(async (req, res) => {
    try {
        let leadExisting = await Lead.findByIdAndUpdate(req.body.id, {
            is_favorite: req.body.favorite
        });
        return res.status(200).json({
            success: true,
            msg: "Process Complete",
        }).end();
    } catch (err) {
        return res.status(400).json({
            success: false,
            msg: "Error in process. " + err.message,
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
    addNext,
    editNext,
    getNext,
    moveToProspect,
    importExcel,
    setAsFavorite,
    addOtherContact,
    getOtherContact
}