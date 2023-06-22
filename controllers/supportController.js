const asyncHandler = require('express-async-handler')
const SupportModel = require('../models/supportModel')
const Support = SupportModel.SupportModal;
const { sendMail } = require('../middleware/sendMail')

const addSupport = asyncHandler(async (req, res) => {
    try {
        await Support.create({
            Customer: req.body.customer,
            TicketNo: req.body.ticketNo,
            Qty: req.body.qty,
            Price: req.body.price,
            TicketDate: req.body.ticketDate,
            DueDate: req.body.dueDate,
            Note: req.body.note,
            Status: "Pending",
            Executive: req.body.executive,
            Products: req.body.product,
            addedBy: req.user._id
        });
        return res.status(200).json({
            success: true,
            msg: "Support added successfully"
        });
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
            Executive: req.body.executive,
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
        let SupportList = await Support.find({ is_active: req.body.active }).populate("Customer").populate("Executive").populate("Products").populate("addedBy", "_id name email role")
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
        let SupportList = await Support.find({ _id: req.params.id }).populate("Customer").populate("Executive").populate("Products").populate("addedBy", "_id name email role");
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