const asyncHandler = require('express-async-handler')
const InvoiceModal = require('../models/invoiceModel')
const User = require('../models/userModel')
const notificationModel = require('../models/notificationModel')
const Invoice = InvoiceModal.InvoiceModal
const InvoiceProduct = InvoiceModal.InvoiceProductModal
const InvoiceTermsandCondition = InvoiceModal.InvoiceTermsandCondition
const OrderModal = require('../models/orderModel')
const OrderObject = OrderModal.OrderModal

const addInvoice = asyncHandler(async (req, res) => {
    try {
        let invoiceNo = await Invoice.find({}, { InvoiceNo: 1, _id: 0 }).sort({ InvoiceNo: -1 }).limit(1);
        let maxInvoice = 1;
        if (invoiceNo.length >0) {
            maxInvoice = invoiceNo[0].InvoiceNo + 1;
        }

        const newInvoice = await Invoice.create({
            InvoiceNo: maxInvoice,
            Customer: req.body.customer,
            ShippingAddress: req.body.shippingAddress||null,
            BillingAddress: req.body.billingAddress||null,
            Order: req.body.orderId,
            Amount: req.body.amount,
            CGST: req.body.CGST,
            SGST: req.body.SGST,
            Discount: req.body.discount,
            TotalTax: req.body.totalTax,
            TotalPrice: req.body.totalPrice,
            InvoiceDate: new Date(),
            DeliveryDate: req.body.deliveryDate,
            Sales: req.body.sales,
            Note: req.body.note,
            addedBy: req.user._id,
            is_deleted: false
        });

        //adding product
        var products = [];

        for (var i = 0; i < req.body.products.length; i++) {
            var pr = req.body.products[i];
            var newPr = {
                InvoiceId: newInvoice._id.toString(),
                Product: (pr.product),
                Quantity: pr.quantity,
                Unit: pr.unit,
                Price: pr.price,
                CGST: pr.CGST,
                SGST: pr.SGST,
                TotalAmount: pr.totalAmount,
                Note: pr.note
            }
            products.push(newPr);
        }

        const prInvoice = await InvoiceProduct.create(products);
        for (var i = 0; i < prInvoice.length; i++) {
            newInvoice.Products.push(prInvoice[i]);
        }

        //adding terms and condition
        var condition = [];
        for (var i = 0; i < req.body.TermsAndCondition.length; i++) {
            var tr = req.body.TermsAndCondition[i];
            var newTr = {
                InvoiceId: newInvoice._id.toString(),
                condition: tr
            }
            condition.push(newTr);
        }
        const trInvoice = await InvoiceTermsandCondition.create(condition);

        for (var i = 0; i < trInvoice.length; i++) {
            newInvoice.TermsAndCondition.push(trInvoice[i]);
        }
        newInvoice.save((err) => {
            if (err) throw err;
        });

        if (newInvoice) {
            let resuser = await User.find({ is_active: true, role: 'Admin' });
            let date = new Date();
            const savedNotification = await notificationModel.create({
                description: `Invoice(${newInvoice.InvoiceNo}) entry has been created`,
                date: date,
                userId: newInvoice.Sales,
                Isread: false
            });
            let insertdata = resuser.map(f => ({
                description: `Invoice(${newInvoice.InvoiceNo}) entry has been created`,
                date: date,
                userId: f._id,
                Isread: false
            }));
            if (insertdata.length > 0) {
                const savedNotification = await notificationModel.insertMany(insertdata);
            }
            return res.status(200).json(newInvoice).end();
        }
        else {
            res.status(400)
            throw new Error("Invalid Invoice data!")
        }
    } catch (err) {
        return res.status(400).json({
            success: false,
            msg: "Error in creating Invoice. " + err.message,
            data: null,
        });
    }

});

const createOrderInvoice = asyncHandler(async (req, res) => {
    const orderDetail = await OrderObject.findOne({ is_deleted: false, _id: req.params.id })
        .populate({
            path: 'Products',
            populate: {
                path: 'Product',
            }
        });

    if (orderDetail.Invoice_Created) {
        return res.status(400).json({
            success: false,
            msg: "Invoice already created",
        });
    }

    let invoiceNo = await Invoice.find({}, { InvoiceNo: 1, _id: 0 }).sort({ InvoiceNo: -1 }).limit(1);
    let maxInvoice = 1;
    if (invoiceNo) {
        maxInvoice = invoiceNo[0].InvoiceNo + 1;
    }

    const orderProduct = orderDetail.Products;

    try {

        const newInvoice = await Invoice.create({
            InvoiceNo: maxInvoice,
            Customer: orderDetail.Customer,
            ShippingAddress: orderDetail.ShippingAddress,
            BillingAddress: orderDetail.BillingAddress,
            Order: req.param.id,
            Amount: orderDetail.Amount,
            CGST: orderDetail.CGST,
            SGST: orderDetail.SGST,
            Discount: orderDetail.Discount,
            TotalTax: orderDetail.TotalTax,
            TotalPrice: orderDetail.TotalPrice,
            InvoiceDate: new Date(),
            Sales: orderDetail.Sales,
            Note: orderDetail.Note,
            addedBy: req.user._id,
            is_deleted: false
        });
        var products = [];

        for (var i = 0; i < orderProduct.length; i++) {
            var pr = orderProduct[i];
            var newPr = {
                InvoiceId: newInvoice._id.toString(),
                Product: (pr.Product),
                Quantity: pr.Quantity,
                Unit: pr.Unit,
                Price: pr.Price,
                CGST: pr.CGST,
                SGST: pr.SGST,
                Discount: pr.Discount,
                TotalAmount: pr.TotalAmount,
                Note: pr.Note
            }
            products.push(newPr);
        }

        const prInvoice = await InvoiceProduct.create(products);
        for (var i = 0; i < prInvoice.length; i++) {
            newInvoice.Products.push(prInvoice[i]);
        }
        newInvoice.save((err) => {
            if (err) throw err;
        });

        const newOrder = await OrderObject.findByIdAndUpdate(req.params.id, {
            Invoice_Created: true
        });

        return res.status(200).json(newInvoice).end();
    } catch (err) {
        return res.status(400).json({
            success: false,
            msg: "Error in creating Invoice. " + err.message,
        });
    }

});

const editInvoice = asyncHandler(async (req, res) => {
    try {
        const oldInvoice = await Invoice.findById(req.body.id);
        if (!oldInvoice) {
            return res.status(400).json({
                success: false,
                msg: "Invoice not found"
            });
        }

        await Invoice.findByIdAndUpdate(req.body.id, {
            Customer: req.body.customer,
            ShippingAddress: req.body.shippingAddress,
            BillingAddress: req.body.billingAddress,
            Order: req.body.orderId,
            Amount: req.body.amount,
            CGST: req.body.CGST,
            SGST: req.body.SGST,
            Discount: req.body.discount,
            TotalTax: req.body.totalTax,
            TotalPrice: req.body.totalPrice,
            DeliveryDate: req.body.deliveryDate,
            Sales: req.body.sales,
            TermsAndCondition: req.body.termsCondition,
            InvoiceDate: req.body.invoiceDate,
            Note: req.body.note
        });

        await InvoiceProduct.deleteMany({ InvoiceId: req.body.id }).lean().exec((err, doc) => {
            if (err) {
                return res.status(401).json({
                    success: false,
                    msg: err
                }).end();
            }
        });

        await InvoiceTermsandCondition.deleteMany({ InvoiceId: req.body.id }).lean().exec((err, doc) => {
            if (err) {
                return res.status(401).json({
                    success: false,
                    msg: err
                }).end();
            }
        });

        // adding product
        var products = [];

        for (var i = 0; i < req.body.products.length; i++) {
            var pr = req.body.products[i];
            var newPr = {
                InvoiceId: req.body.id,
                Product: pr.product,
                Quantity: pr.quantity,
                Unit: pr.unit,
                Price: pr.price,
                CGST: pr.CGST,
                SGST: pr.SGST,
                TotalAmount: pr.totalAmount,
                Note: pr.note
            }
            products.push(newPr);
        }

        const prInvoice = await InvoiceProduct.create(products);

        for (var i = 0; i < prInvoice.length; i++) {
            oldInvoice.Products.push(prInvoice[i]);
        }

        //adding terms and condition
        var condition = [];
        for (var i = 0; i < req.body.TermsAndCondition.length; i++) {
            var tr = req.body.TermsAndCondition[i];
            var newTr = {
                InvoiceId: oldInvoice._id.toString(),
                condition: tr
            }
            condition.push(newTr);
        }
        const trInvoice = await InvoiceTermsandCondition.create(condition);

        for (var i = 0; i < trInvoice.length; i++) {
            oldInvoice.TermsAndCondition.push(trInvoice[i]);
        }

        oldInvoice.save((err) => {
            if (err) throw err;
        });
        return res.status(200).json({
            success: true,
            msg: "Invoice Updated",
        }).end();
    } catch (err) {
        return res.status(400).json({
            success: false,
            msg: "Error in creating Invoice. " + err.message,
            data: null,
        });
    }

});

const removeInvoice = asyncHandler(async (req, res) => {
    try {
        const existCustomer = await Invoice.findById(req.params.id);
        if (!existCustomer) {
            return res.status(200).json({
                success: false,
                msg: "Invoice not found."
            });
        }

        const newInvoice = await Invoice.findByIdAndUpdate(req.params.id, {
            is_deleted: true
        });

        return res.status(200).json({
            success: true,
            msg: "Invoice removed. "
        }).end();
    } catch (err) {
        return res.status(400).json({
            success: false,
            msg: "Error in removing Invoice. " + err.message
        });
    }

});

const getAllInvoice = asyncHandler(async (req, res) => {
    try {
        let invoiceList = await Invoice.find({ is_deleted: false })
            .populate("Customer")
            .populate({
                path: 'Products',
                populate: {
                    path: 'Product',
                }
            })
            .populate("ShippingAddress")
            .populate("BillingAddress")
            .populate("TermsAndCondition")
            .populate("Sales", 'name email')
            .populate("addedBy", 'name email')
            .sort({ createdAt: -1 })
        return res.status(200).json({
            success: true,
            data: invoiceList
        }).end();
    } catch (err) {
        return res.status(400).json({
            success: false,
            msg: "Error in getting Invoice. " + err.message,
            data: null,
        });
    }
})

const getInvoiceById = asyncHandler(async (req, res) => {
    try {
        let invoiceList = await Invoice.find({ is_deleted: false, _id: req.params.id })
            .populate("Customer")
            .populate({
                path: 'Products',
                populate: {
                    path: 'Product',
                }
            })
            .populate("ShippingAddress")
            .populate("BillingAddress")
            .populate("TermsAndCondition")
            .populate("Sales", 'name email')
            .populate("addedBy", 'name email')

        return res.status(200).json({
            success: true,
            data: invoiceList
        }).end();
    } catch (err) {
        return res.status(400).json({
            success: false,
            msg: "Error in getting Invoice. " + err.message,
            data: null,
        });
    }
})


module.exports = {
    addInvoice,
    editInvoice,
    removeInvoice,
    getAllInvoice,
    getInvoiceById,
    createOrderInvoice
}