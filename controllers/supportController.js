const asyncHandler = require('express-async-handler')
const SupportModel = require('../models/supportModel')
const { ObjectId } = require('mongodb');
const User = require('../models/userModel')
// const notificationModel = require('../models/notificationModel')
const Support = SupportModel.SupportModal;
const SupportnextOns = SupportModel.SupportNextOnModal;
const Master = require('../models/masterModel')
const Status = Master.StatusModal;
const { sendMail } = require('../middleware/sendMail')
const moment = require('moment')
var pdf = require('html-pdf')
var fs = require('fs')
var converter = require('number-to-words')
var format = require('date-format')
var test = require('tape')
var path = require('path')
// const Template = require('../models/templateModel')
const TempModal = require('../models/templateModel')
const Templates = TempModal.TemplateModal;
const { generatePDF } = require('../services/pdfService')
const ApplicationSetting = Master.ApplicationSettingModal;
const SassMaster = require('../models/saasmasterModel');
const ApplicationSettings = SassMaster.ApplicationSettingModal;
const Statuss = SassMaster.StatusModal;
const Productss = SassMaster.ProductModal;
const NotifModal = require('../models/notificationModel')
const Notification = NotifModal.NotificationModal;
const CustomerModal = require('../models/customerModel')
const Customers = CustomerModal.CustomerModal

const addSupport = asyncHandler(async (req, res) => {
    try {
        // let ticketNo = await Support.find({}, { TicketNo: 1, _id: 0 }).sort({ TicketNo: -1 }).limit(1);
        // let maxTicket = 1;
        // if (ticketNo.length > 0) {
        //     maxTicket = ticketNo[0].TicketNo + 1;
        // }
        let Status = Statuss(req.conn);
        let ApplicationSetting = ApplicationSettings(req.conn);
        let Supports = Support(req.conn);
        let notificationModel = Notification(req.conn);
        let TicketNo = await Supports.find({}, { TicketNo: 1, _id: 0 }).sort({ TicketNo: -1 }).limit(1);
        let maxTicket = 1;
        if (TicketNo.length > 0) {
            maxTicket = TicketNo[0].TicketNo + 1;
        }
        let applicationSetting = await ApplicationSetting.findOne();
        let code = "";
        const currentDate = new Date();
        const currentYear = currentDate.getFullYear();
        let financialYearStart, financialYearEnd;
        if (currentDate.getMonth() >= 3) {
            financialYearStart = currentYear;
            financialYearEnd = currentYear + 1;
        } else {
            financialYearStart = currentYear - 1;
            financialYearEnd = currentYear;
        }
        if (applicationSetting.Ticket == true) {
            code = req.body.ticketcode;
        }
        else {
            code = applicationSetting.TicketPrefix + maxTicket + `/${financialYearStart}-${financialYearEnd}` + applicationSetting.TicketSuffix;
        }
        const existTicketCode = await Supports.findOne({ $or: [{ TicketCode: req.body.ticketcode }] });
        if (existTicketCode) {
            return res.status(200).json({
                success: false,
                msg: "support Ticket already exist with same support Ticket code.",
                data: null,
            });
        }
        let status = await Status.find({ GroupName: "Support" }).lean();
        const newSupport = await Supports.create({
            Customer: req.body.customer,
            TicketNo: maxTicket,
            TicketCode: code,
            Qty: req.body.qty,
            Price: req.body.price,
            TicketDate: req.body.ticketDate,
            DueDate: req.body.dueDate,
            Note: req.body.note,
            Status: status[0],
            Sales: req.body.sales,
            Products: req.body.product,
            addedBy: req.user._id
        });
        if (newSupport) {
            let date = new Date();
            const savedNotification = await notificationModel.create({
                description: `Support(${newSupport.TicketCode}) entry has been created`,
                date: date,
                link: "Support",
                userId: newSupport.Sales,
                Isread: false
            });
            // let resuser = await User.find({ is_active: true, role: 'SuperAdmin' });
            // let insertdata = resuser.map(f => ({
            //     description: `Support(${newSupport.TicketNo}) entry has been created`,
            //     date: date,
            //     link: "Support",
            //     userId: f._id,
            //     Isread: false
            // }));
            // if (insertdata.length > 0) {
            //     const savedNotification = await notificationModel.insertMany(insertdata);
            // }
            return res.status(200).json(newSupport).end();
        }
        else {
            res.status(400)
            throw new Error("Invalid Support data!")
        }
    } catch (err) {
        return res.status(400).json({
            success: false,
            msg: "Error in adding Support. " + err.message
        });
    }
})
const editSupport = asyncHandler(async (req, res) => {
    try {
        let Supports = Support(req.conn);

        var existing = await Supports.findById(req.body.id);
        if (!existing) {
            return res.status(400).json({
                success: false,
                msg: "Support not found. " + err.message,
            });

        }

        await Supports.findByIdAndUpdate(req.body.id, {
            Customer: req.body.customer,
            TicketCode: req.body.ticketcode,
            // TicketNo: req.body.ticketNo,
            Qty: req.body.qty,
            Price: req.body.price,
            TicketDate: req.body.ticketDate,
            DueDate: req.body.dueDate,
            Note: req.body.note,
            Sales: req.body.sales,
            Products: req.body.product,
        });
        return res.status(200).json({
            success: true,
            msg: "Support updated successfully"
        });
    } catch (err) {
        return res.status(400).json({
            success: false,
            msg: "Error in updating Support. " + err.message
        });
    }
})
const getAllSupport = asyncHandler(async (req, res) => {
    try {        
        let Supports = Support(req.conn);
        
        let { skip, per_page } = req.body;
        let query = [];
        query.push({
            $match: { is_active: req.body.active }
        });
        if (req.body.status) {
            query.push(
                {
                    $match: { Status: ObjectId(req.body.status) }
                });
        }
        if (req.body.sales) {
            query.push({
                $match: { Sales: ObjectId(req.body.sales) }
            });
        }
        query.push(
            {
                '$lookup': {
                    'from': 'customers',
                    'localField': 'Customer',
                    'foreignField': '_id',
                    'as': 'Customer'
                }
            },
            {
                $unwind: {
                    path: '$Customer'
                },
            },
            {
                '$lookup': {
                    'from': 'products',
                    'localField': 'Products',
                    'foreignField': '_id',
                    'as': 'Products'
                }
            },
            {
                $unwind: {
                    path: '$Products',
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
                '$lookup': {
                    'from': 'supportnextons',
                    'localField': 'NextTalk',
                    'foreignField': '_id',
                    'as': 'NextTalk'
                }
            },
            {
                $unwind: {
                    path: '$NextTalk',
                    preserveNullAndEmptyArrays: true
                },
            },
            {
                $sort: { createdAt: -1 }
            }
        );
        if (req.body.filter) {
            query.push(
                {
                    $match: { "Customer.Company": { $regex: new RegExp(req.body.filter, "i") } },
                });
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
        const SupportList = await Supports.aggregate(query).exec();
        let lastTicketCode = await Supports.find().sort({ createdAt: -1 })
        if (SupportList.length == 0) {
            return res.status(200).json({
                success: true,
                data: { Count: 0, data: [] }
            }).end();
        }
        else {
            return res.status(200).json({
                success: true,
                data: SupportList[0],
                lastTicketCode: lastTicketCode[0],
            }).end();
        }
    } catch (err) {
        return res.status(400).json({
            success: false,
            msg: "Error in getting Support. " + err.message,
            data: null,
        });
    }
});

const getSupportById = asyncHandler(async (req, res) => {
    try {
        let Supports = Support(req.conn);
        let Customer = Customers(req.conn);
        let Products = Productss(req.conn);
        let users = User(req.conn);

        let SupportList = await Supports.find({ _id: req.params.id }).populate("Customer").populate("Sales").populate("Products").populate("addedBy", "_id name email role");
        return res.status(200).json({
            success: true,
            data: SupportList
        }).end();
    } catch (err) {
        return res.status(400).json({
            success: false,
            msg: "Error in getting Support. " + err.message,
            data: null,
        });
    }

});

const updateStatus = asyncHandler(async (req, res) => {
    try {
        let Supports = Support(req.conn);
        await Supports.findByIdAndUpdate(req.body.id, {
            Status: req.body.status
        })
        return res.status(200).json({
            success: true,
            msg: "Support Status updated",
        }).end();
    } catch (err) {
        return res.status(400).json({
            success: false,
            msg: "Error in updating Support. " + err.message
        });
    }

});

const removeSupport = asyncHandler(async (req, res) => {
    try {
        let Supports = Support(req.conn);
        const existSupport = await Supports.findById(req.body.id);
        if (!existSupport) {
            return res.status(200).json({
                success: false,
                msg: "Support not found.",
                data: null,
            });
        }

        const newSupport = await Supports.findByIdAndUpdate(req.body.id, {
            is_active: req.body.active
        });

        return res.status(200).json({
            success: true,
            msg: "Support removed. ",
            data: null
        }).end();
    } catch (err) {
        return res.status(400).json({
            success: false,
            msg: "Error in removing Support. " + err.message,
            data: null,
        });
    }

});

const deleteSupport = asyncHandler(async (req, res) => {
    try {
        let Supports = Support(req.conn);
        await Supports.deleteOne({ _id: req.params.id }).lean().exec((err, doc) => {
            if (err) {
                return res.status(401).json({
                    success: false,
                    msg: err
                }).end();
            } else {
                return res.status(200).json({
                    success: true,
                    msg: "Support removed. ",
                }).end();
            }
        });

    } catch (err) {
        return res.status(400).json({
            success: false,
            msg: "Error in removing Support. " + err.message,
            data: null,
        });
    }

});

const addNext = asyncHandler(async (req, res) => {
    try {
        let SupportnextOn = SupportnextOns(req.conn);
        let Supports = Support(req.conn);

        let supportNextOn = await SupportnextOn.create({
            supportId: req.body.supportid,
            date: req.body.date,
            note: req.body.note,
            user: req.user._id
        });

        let supportExisting = await Supports.findByIdAndUpdate(req.body.supportid, {
            NextTalk: supportNextOn._id
        });
        if (supportNextOn) {
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
        let SupportnextOn = SupportnextOns(req.conn);
        let supportNextOn = await SupportnextOn.findByIdAndUpdate(req.body.id, {
            date: req.body.date,
            note: req.body.note,
            user: req.user._id
        });

        if (supportNextOn) {
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
        let SupportnextOn = SupportnextOns(req.conn);
        let users = User(req.conn);
        const next = await SupportnextOn.find({ supportId: req.params.id })
            .sort({ date: -1 })
            .populate("user");
        res.status(200).json({
            success: true,
            msg: "",
            data: next || [],
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            msg: "Error in getting status. " + err.message,
            data: null,
        });
    }
});
const Supportpdfcreate = asyncHandler(async (req, res) => {
    try {
        let Supports = Support(req.conn);
        let Customer = Customers(req.conn);
        let Products = Productss(req.conn);
        let users = User(req.conn);
        let Template = Templates(req.conn);
        let SupportnextOn = SupportnextOns(req.conn);
        
        const data = await Template.findById(req.body.template_id)
        var template = path.join(__dirname, '..', 'public', 'template.html')
        var templateHtml = fs.readFileSync(template, 'utf8')
        templateHtml = templateHtml.replace('{{Data}}', data.Detail)
        var filename = template.replace('template.html', `Print.pdf`)
        let customerList = await Supports.find({ is_deleted: false, _id: req.body.id })
            .populate("Customer").populate("Sales");
        const next = await SupportnextOn.find({ supportId: req.body.id })
            .sort({ date: -1 })
            .populate("user");
        templateHtml = templateHtml.replace('{{token.cmcompany}}', customerList[0].Customer?.Company)
        templateHtml = templateHtml.replace('{{token.ticketdate}}', moment(customerList[0].TicketDate).format("DD-MMM-YY"))
        templateHtml = templateHtml.replace('{{token.duedate}}', moment(customerList[0].DueDate).format("DD-MMM-YY"))
        templateHtml = templateHtml.replace('{{token.sales}}', customerList[0].Sales?.name)
        templateHtml = templateHtml.replace('{{token.note}}', customerList[0].Note)
        templateHtml = templateHtml.replace('{{token.TicketNo}}', customerList[0].TicketCode || '')
        templateHtml = templateHtml.replace('{{token.table}}', `<table border="1" cellpadding="10" cellspacing="0" style="width:100%;border-collapse: collapse;border-left:revert-layer">
        <tbody>
            <tr>
            <th style="font-size: 11px;">Send by</th>
            <th style="font-size: 11px;">Date</th>
            <th style="font-size: 11px;">Note</th>
            </tr>
            ${next?.map((x, i) => (
            `<tr>
            <td style="font-size: 11px;text-align:left">${x.user?.name}</td>
            <td style="font-size: 11px;text-align:left">${moment(x.date).format("DD-MMM-YY")}</td>
            <td style="font-size: 11px;text-align:left">${x.note}</td>
            </tr>`
        ))}
        </tbody>
        </table>`)
        const pdfBufferHtml = await generatePDF(templateHtml);
        res.contentType('application/pdf');
        res.send(pdfBufferHtml);

    } catch (err) {
        return res.status(400).json({
            success: false,
            msg: err.message,
            data: null,
        });
    }

})

module.exports = {
    addSupport,
    getAllSupport,
    getSupportById,
    editSupport,
    updateStatus,
    removeSupport,
    deleteSupport,
    addNext,
    editNext,
    getNext,
    Supportpdfcreate
}