const asyncHandler = require('express-async-handler')
const { ObjectId } = require('mongodb');
const LeadModal = require('../models/leadModel')
const Users = require('../models/userModel')
const notificationModels = require('../models/notificationModel')
const Leads = LeadModal.LeadsModal;
const nextoncontactModel = require('../models/nextoncontactModel')
const NextOn = nextoncontactModel.NextOnModal;
const OtherContact = nextoncontactModel.OtherContact;
const SassMaster = require('../models/saasmasterModel');
const Sources = SassMaster.SourceModal;
const Countrys = SassMaster.CountryModal;
const States = SassMaster.StateModal;
const Citys = SassMaster.CityModal;
const Icons = SassMaster.IconModal;
const Products = SassMaster.ProductModal;
const Statuss = SassMaster.StatusModal;
const ProspectModal = require('../models/prospectModel')
const TaskModal = require('../models/taskModel');
const Tasks = TaskModal.TaskModal;
const uploadFile = require("../middleware/uploadFileMiddleware");
const readXlsxFile = require('read-excel-file/node')
const path = require("path");

const addLead = asyncHandler(async (req, res) => {
    try {
        let Lead = Leads(req.conn);
        let notificationModel = notificationModels(req.conn);
        const newLead = await Lead.create({
            Company: req.body.company,
            Title: req.body.title,
            GSTNo: req.body.gstno,
            FirstName: req.body.firstname,
            LastName: req.body.lastname,
            Address: req.body.address,
            Designation: req.body.designation,
            Icon: req.body.icon || null,
            Mobile: req.body.mobile,
            Email: req.body.email,
            City: req.body.city || null,
            State: req.body.state || null,
            Country: req.body.country || null,
            Source: req.body.source || null,
            Product: req.body.product || null,
            Requirements: req.body.requirements,
            Notes: req.body.notes,
            InCharge: req.body.incharge,
            NextTalkon: req.body.nextTalkOn,
            NextTalkNotes: req.body.nextTalkNotes,
            CustomerRefrence: req.body.CustomerRefrence,
            Sales: req.body.sales || null,
            addedBy: req.user._id,
            Stage: "New",
            Status: req.body.status,
            LeadSince: new Date(),
            StageDate: new Date(),
            is_active: true
        });
        if (newLead) {
            let date = new Date();
            const savedNotification = await notificationModel.create({
                description: `lead(${req.body.company}) entry has been created`,
                date: date,
                link: "Leads",
                userId: newLead.Sales,
                Isread: false
            });
            // let resuser = await User.find({ is_active: true, role: 'SuperAdmin' });
            // let insertdata = resuser.map(f => ({
            //     description: `lead(${req.body.company}) entry has been created`,
            //     date: date,
            //     link:"Leads",
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
        let Lead = Leads(req.conn);
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
            Address: req.body.address,
            Designation: req.body.designation,
            Icon: req.body.icon || null,
            Mobile: req.body.mobile,
            Email: req.body.email,
            City: req.body.city || null,
            State: req.body.state || null,
            Country: req.body.country || null,
            Source: req.body.source || null,
            Product: req.body.product || null,
            Requirements: req.body.requirements,
            CustomerRefrence: req.body.CustomerRefrence,
            Sales: req.body.sales || null,
            Notes: req.body.notes,
            Status: req.body.status,
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
        let Lead = Leads(req.conn);
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
        let Lead = Leads(req.conn);
        let { skip, per_page, startdate, enddate } = req.body;
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

        if (req.body.icon) {
            query.push({
                $match: { Icon: ObjectId(req.body.icon) }
            });
        }
        if (startdate && enddate) {
            const start = new Date(startdate);
            const end = new Date(enddate);
            end.setDate(end.getDate() + 1);
            query.push({
                $match: {
                    LeadSince: {
                        $gte: start,
                        $lt: end
                    }
                }
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
            },
            {
                '$lookup': {
                    'from': 'sources',
                    'localField': 'Source',
                    'foreignField': '_id',
                    'as': 'Source'
                }
            },
            {
                $unwind: {
                    path: '$Source',
                    preserveNullAndEmptyArrays: true
                },
            },
            {
                '$lookup': {
                    'from': 'icons',
                    'localField': 'Icon',
                    'foreignField': '_id',
                    'as': 'Icon'
                }
            },
            {
                $unwind: {
                    path: '$Icon',
                    preserveNullAndEmptyArrays: true
                },
            },
            {
                '$lookup': {
                    'from': 'countries',
                    'localField': 'Country',
                    'foreignField': '_id',
                    'as': 'Country'
                }
            },
            {
                $unwind: {
                    path: '$Country',
                    preserveNullAndEmptyArrays: true
                },
            },
            {
                '$lookup': {
                    'from': 'states',
                    'localField': 'State',
                    'foreignField': '_id',
                    'as': 'State'
                }
            },
            {
                $unwind: {
                    path: '$State',
                    preserveNullAndEmptyArrays: true
                },
            },
            {
                '$lookup': {
                    'from': 'cities',
                    'localField': 'City',
                    'foreignField': '_id',
                    'as': 'City'
                }
            },
            {
                $unwind: {
                    path: '$City',
                    preserveNullAndEmptyArrays: true
                },
            },
            {
                '$lookup': {
                    'from': 'status',
                    'localField': 'Status',
                    'foreignField': '_id',
                    'as': 'Status'
                }
            },
            {
                $unwind: {
                    path: '$Status',
                    preserveNullAndEmptyArrays: true
                },
            },
            {
                $sort: { createdAt: -1 }
            }
        );
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
        let Lead = Leads(req.conn);
        let Task = Tasks(req.conn);
        let Source = Sources(req.conn);
        let Country = Countrys(req.conn);
        let State = States(req.conn);
        let City = Citys(req.conn);
        let Icon = Icons(req.conn);
        let Product = Products(req.conn);
        let User = Users(req.conn);
        let OtherContact = LeadOtherContacts(req.conn);    
        let NextTalk = NextOns(req.conn);      
        let Status = Statuss(req.conn);

        let leadList = await Lead.find({ Stage: "New", _id: req.params.id }).populate("Source").populate("Country").populate("State").populate("City").populate("Icon").populate("OtherContact").populate("Product").populate("Sales").populate("NextTalk").populate("addedBy");

        let tasklist = await Task.find({ is_active: true, LeadId: req.params.id }).populate("Status").populate("Assign");
        return res.status(200).json({
            success: true,
            data: { leadList, tasklist }
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
        let NextOn = NextOns(req.conn); 
        let Lead = Leads(req.conn);            

        let nextOn = await NextOn.create({
            leadId: req.body.leadid,
            prospectId: null,
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
        let NextOn = NextOns(req.conn); 

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
        let NextOn = NextOns(req.conn); 
        let User = Users(req.conn);
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
        let Lead = Leads(req.conn);
        let LeadOtherContact = LeadOtherContacts(req.conn);    

        let leadExist = await Lead.findById(req.body.id);
        let nextOn = await OtherContact.create({
            LeadId: req.body.id,
            ProspectId: null,
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
        let LeadOtherContact = OtherContact(req.conn);  

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
        let Lead = Leads(req.conn);
        let Status = Statuss(req.conn);
        let NextOn = NextOns(req.conn);  
        let Prospect = Prospects(req.conn);       
        let ProNextOn = ProNextOns(req.conn);
        let notificationModel = notificationModels(req.conn);        

        let leadExisting = await Lead.findById(req.params.id);
        if (leadExisting.Stage == "Prospect") {
            return res.status(400).json({
                success: false,
                msg: "Lead already moved to prospect. "
            });
        }

        let status = await Status.find({ GroupName: "Prospects" }).lean();
        let interaction = await Prospect.create({
            Company: leadExisting.Company,
            Title: leadExisting.Title,
            GSTNo: leadExisting.GSTNo,
            FirstName: leadExisting.FirstName,
            LastName: leadExisting.LastName,
            Address: leadExisting.Address,
            Mobile: leadExisting.Mobile,
            Email: leadExisting.Email,
            Website:null,
            City: leadExisting.City || null,
            State: leadExisting.State || null,
            Country: leadExisting.Country || null,
            Product: leadExisting.Product || null,
            Notes: leadExisting.Notes,
            ProspectAmount: 0,
            OrderTarget: null,
            Sales: leadExisting.Sales || null,
            addedBy: req.user._id,
            Stage: status[0]._id,
            StageDate: new Date(),
            Requirements: leadExisting.Requirements,
            Source:leadExisting.Source,
            CustomerRefrence: leadExisting.CustomerRefrence,
            is_active: true,
            Customer:null
        });
        if (interaction) {
            await Lead.findByIdAndUpdate(req.params.id, {
                Stage: "Prospect",
                StageDate: new Date()
            });
            const next = await NextOn.find({ leadId: req.params.id }).sort({ date: -1 });
            let insertProspectNext = next.map(f => ({
                leadId: null,
                prospectId: interaction._id,
                date: f.date,
                note: f.note,
                user: req.user._id
            }));
            if (insertProspectNext.length > 0) {
                const savednext = await NextOn.insertMany(insertProspectNext);
                let prospectExisting = await Prospect.findByIdAndUpdate(interaction._id, {
                    NextTalk: savednext[0]._id
                });
            }
            const tasklist = await Task.find({ LeadId: req.params.id });
            let insertProspecttask = tasklist.map(f => ({
                LeadId: null,
                ProspectId: interaction._id,
                Name: f.Name,
                Description: f.Description,
                Status: f.Status || null,
                Assign: f.Assign || null,
                Reporter: f.Reporter || null,
                Priority: f.Priority,
                StartDate: f.StartDate,
                EndDate: f.EndDate,
                is_active: f.is_active,
                addedBy: req.user._id
            }));
            if (insertProspecttask.length > 0) {
                const savedProspecttask = await Task.insertMany(insertProspecttask);
            }
            if (interaction.Sales) {
            let date = new Date();
                const savedNotification = await notificationModel.create({
                    description: `lead(${interaction.Company}) Moved to prospect`,
                    date: date,
                    link: "Prospects",
                    userId: interaction.Sales,
                    Isread: false
                });
            }
            // let resuser = await User.find({ is_active: true, role: 'SuperAdmin' });
            // let insertdata = resuser.map(f => ({
            //     description: `lead(${interaction.Company}) Moved to prospect`,
            //     date: date,
            //     link:"Prospects",
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
        let Lead = Leads(req.conn);        
        let Source = Sources(req.conn);
        let Product = Products(req.conn);
        let Country = Countrys(req.conn);
        let State = States(req.conn);
        let City = Citys(req.conn);

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
                    var CountryId = await Country.findOne({ Name: { $regex: val[9], $options: 'i' } }, { _id: 1 });
                    if (!CountryId) {
                        return res.status(400).json({
                            success: true,
                            msg: val[9] + " Country not found. ",
                            data: null,
                        });
                    }
                    var StateId = await State.findOne({ Name: { $regex: val[8], $options: 'i' } }, { _id: 1 });
                    if (!StateId) {
                        return res.status(400).json({
                            success: true,
                            msg: val[8] + " State not found. ",
                            data: null,
                        });
                    }
                    var CityId = await City.findOne({ Name: { $regex: val[7], $options: 'i' } }, { _id: 1 });
                    if (!CityId) {
                        return res.status(400).json({
                            success: true,
                            msg: val[7] + " City not found. ",
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
                        City: CityId._id,
                        State: StateId._id,
                        Country: CountryId._id,
                        Source: sourceId._id,
                        Product: productId._id,
                        Requirements: val[12],
                        Notes: val[13],
                        InCharge: val[14],
                        NextTalkon: val[16],
                        NextTalkNotes: val[17],
                        Icon: val[18],
                        CustomerRefrence: val[19],
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
        let Lead = Leads(req.conn);

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