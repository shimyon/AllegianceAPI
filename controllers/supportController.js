const asyncHandler = require('express-async-handler')
const SupportModel = require('../models/supportModel')
const User = require('../models/userModel')
const notificationModel = require('../models/notificationModel')
const Support = SupportModel.SupportModal;
const { sendMail } = require('../middleware/sendMail')

const addSupport = asyncHandler(async (req, res) => {
    try {
        let ticketNo = await Support.find({}, { TicketNo: 1, _id: 0 }).sort({ TicketNo: -1 }).limit(1);
        let maxTicket = 1;
        if (ticketNo.length >0) {
            maxTicket = ticketNo[0].TicketNo + 1;
        }
        const newSupport =  await Support.create({
            Customer: req.body.customer,
            TicketNo: maxTicket,
            Qty: req.body.qty,
            Price: req.body.price,
            TicketDate: req.body.ticketDate,
            DueDate: req.body.dueDate,
            Note: req.body.note,
            Status: "Pending",
            Sales: req.body.sales,
            Products: req.body.product,
            addedBy: req.user._id
        });
        if (newSupport) {
            let resuser = await User.find({ is_active: true, role: 'Admin' });
            let date = new Date();
            const savedNotification = await notificationModel.create({
                description: `Support(${newSupport.TicketNo}) entry has been created`,
                date: date,
                userId: newSupport.Sales,
                Isread: false
            });
            let insertdata = resuser.map(f => ({
                description: `Support(${newSupport.TicketNo}) entry has been created`,
                date: date,
                userId: f._id,
                Isread: false
            }));
            if (insertdata.length > 0) {
                const savedNotification = await notificationModel.insertMany(insertdata);
            }

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

        var existing = await Support.findById(req.body.id);
        if (!existing) {
            return res.status(400).json({
                success: false,
                msg: "Support not found. " + err.message,
            });

        }

        await Support.findByIdAndUpdate(req.body.id, {
            Customer: req.body.customer,
            TicketNo: req.body.ticketNo,
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
    var condition = { is_active: req.body.active };
    if(req.body.sales)
    {
        condition.Sales=req.body.sales;
    }
    if(req.body.status)
    {
        condition.Status=req.body.status;
    }
    try {
        let SupportList = await Support.find(condition).populate("Customer").populate("Sales").populate("Products").populate("addedBy", "_id name email role")
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

const getSupportById = asyncHandler(async (req, res) => {
    try {
        let SupportList = await Support.find({ _id: req.params.id }).populate("Customer").populate("Sales").populate("Products").populate("addedBy", "_id name email role");
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

const updateSupport = asyncHandler(async (req, res) => {
    try {
        const existSupport = await Support.findById(req.body.id);
        if (!existSupport) {
            return res.status(200).json({
                success: false,
                msg: "Support not found.",
                data: null,
            });
        }
        
        const newSupport = await Support.findByIdAndUpdate(req.body.id, {
            Status: req.body.status,
            AdditionalNote: req.body.additionalNote,
            ReasonForCancel: req.body.reasonforCancel,
            DeliveryDetail: req.body.deliveryDetail,
            DelayReason: req.body.delayReason
        });

        if(req.body.sendMail)
        {
            sendMail(req.body.toMail, "Ticket Update", req.body.additionalNote);
        }
        return res.status(200).json({
            success: true,
            msg: "Status Updated. "
        }).end();
    } catch (err) {
        return res.status(400).json({
            success: false,
            msg: "Error in updating status. " + err.message,
            data: null,
        });
    }

});

const updateStatus = asyncHandler(async (req, res) => {
    try {
        await Support.findByIdAndUpdate(req.body.id,{
            Status:req.body.status
        })
        return res.status(200).json({
            success: true,
            msg: "Status updated",
        }).end();
    } catch (err) {
        return res.status(400).json({
            success: false,
            msg: "Error in updating status. " + err.message
        });
    }

});


module.exports = {
    addSupport,
    getAllSupport,
    getSupportById,
    updateSupport,
    editSupport,
    updateStatus
}