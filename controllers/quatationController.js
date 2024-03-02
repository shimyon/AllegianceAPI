const asyncHandler = require('express-async-handler')
const QuatationModal = require('../models/quatationModel')
const User = require('../models/userModel')
const notificationModel = require('../models/notificationModel')
const Quatation = QuatationModal.QuatationModal
const QuatationProduct = QuatationModal.QuatationProductModal
const QuatationTermsandCondition = QuatationModal.QuatationTermsandCondition
const OrderModal = require('../models/orderModel')
const Order = OrderModal.OrderModal
const OrderProduct = OrderModal.OrderProductModal
var pdf = require('html-pdf')
var fs = require('fs')
var converter = require('number-to-words')
var format = require('date-format')
var test = require('tape')
var path = require('path')
const Template = require('../models/templateModel')
const { generatePDF } = require('../services/pdfService')

const addQuatation = asyncHandler(async (req, res) => {
    try {
        let quatationNo = await Quatation.find({}, { QuatationNo: 1, _id: 0 }).sort({ QuatationNo: -1 }).limit(1);
        let maxQuatation = 1;
        if (quatationNo.length > 0) {
            maxQuatation = quatationNo[0].QuatationNo + 1;
        }
        const newQuatation = await Quatation.create({
            QuatationNo: maxQuatation,
            Customer: req.body.customer,
            ShippingAddress: req.body.shippingAddress || null,
            BillingAddress: req.body.billingAddress || null,
            Status: "New",
            Stage: "New",
            Sales: req.body.sales,
            addedBy: req.user._id,
            Amount: req.body.amount,
            CGST: req.body.CGST,
            SGST: req.body.SGST,
            Discount: req.body.discount,
            TotalTax: req.body.totalTax,
            TotalPrice: req.body.totalPrice,
            QuatationDate: req.body.quatattionDate,
            ValidDate: req.body.vaidDate,
            Note: req.body.note,
            is_deleted: false
        });

        //adding product
        var products = [];

        for (var i = 0; i < req.body.products.length; i++) {
            var pr = req.body.products[i];
            var newPr = {
                QuatationId: newQuatation._id.toString(),
                Product: pr.product,
                Quantity: pr.quantity,
                Unit: pr.unit,
                Price: pr.price,
                CGST: pr.CGST,
                SGST: pr.SGST,
                Amount: pr.Amount,
                TotalAmount: pr.totalAmount,
                Note: pr.note
            }
            products.push(newPr);
        }

        const prQuatation = await QuatationProduct.create(products);
        for (var i = 0; i < prQuatation.length; i++) {
            newQuatation.Products.push(prQuatation[i]);
        }

        //adding terms and condition
        var condition = [];
        for (var i = 0; i < req.body.TermsAndCondition.length; i++) {
            var tr = req.body.TermsAndCondition[i];
            var newTr = {
                QuatationId: newQuatation._id.toString(),
                condition: tr
            }
            condition.push(newTr);
        }
        const trQuatation = await QuatationTermsandCondition.create(condition);

        for (var i = 0; i < trQuatation.length; i++) {
            newQuatation.TermsAndCondition.push(trQuatation[i]);
        }

        newQuatation.save((err) => {
            if (err) throw err;
        });
        if (newQuatation) {
            let resuser = await User.find({ is_active: true, role: 'Admin' });
            let date = new Date();
            const savedNotification = await notificationModel.create({
                description: `Quatation(${newQuatation.QuatationNo}) entry has been created`,
                date: date,
                userId: newQuatation.Sales,
                Isread: false
            });
            let insertdata = resuser.map(f => ({
                description: `Quatation(${newQuatation.QuatationNo}) entry has been created`,
                date: date,
                userId: f._id,
                Isread: false
            }));
            if (insertdata.length > 0) {
                const savedNotification = await notificationModel.insertMany(insertdata);
            }

            return res.status(200).json(newQuatation).end();
        }
        else {
            res.status(400)
            throw new Error("Invalid Quatation data!")
        }
    } catch (err) {
        return res.status(400).json({
            success: false,
            msg: "Error in creating Quatation. " + err.message,
            data: null,
        });
    }

});

const editQuatation = asyncHandler(async (req, res) => {
    try {
        const oldQuatation = await Quatation.findById(req.body.id);
        if (!oldQuatation) {
            return res.status(400).json({
                success: false,
                msg: "Quatation not found"
            });
        }

        await Quatation.findByIdAndUpdate(req.body.id, {
            Customer: req.body.customer,
            ShippingAddress: req.body.shippingAddress,
            BillingAddress: req.body.billingAddress,
            Sales: req.body.sales,
            addedBy: req.user._id,
            Amount: req.body.amount,
            CGST: req.body.CGST,
            SGST: req.body.SGST,
            Discount: req.body.discount,
            TotalTax: req.body.totalTax,
            TotalPrice: req.body.totalPrice,
            QuatationDate: req.body.quatattionDate,
            ValidDate: req.body.vaidDate,
            Note: req.body.note,
        });

        await QuatationProduct.deleteMany({ QuatationId: req.body.id }).lean().exec((err, doc) => {
            if (err) {
                return res.status(401).json({
                    success: false,
                    msg: err
                }).end();
            }
        });

        await QuatationTermsandCondition.deleteMany({ QuatationId: req.body.id }).lean().exec((err, doc) => {
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
                QuatationId: req.body.id,
                Product: pr.product,
                Quantity: pr.quantity,
                Unit: pr.unit,
                Price: pr.price,
                CGST: pr.CGST,
                SGST: pr.SGST,
                Amount: pr.Amount,
                TotalAmount: pr.totalAmount,
                Note: pr.note
            }
            products.push(newPr);
        }

        const prQuatation = await QuatationProduct.create(products);

        for (var i = 0; i < prQuatation.length; i++) {
            oldQuatation.Products.push(prQuatation[i]);
        }

        //adding terms and condition
        var condition = [];
        for (var i = 0; i < req.body.TermsAndCondition.length; i++) {
            var tr = req.body.TermsAndCondition[i];
            var newTr = {
                QuatationId: oldQuatation._id.toString(),
                condition: tr
            }
            condition.push(newTr);
        }
        const trQuatation = await QuatationTermsandCondition.create(condition);

        for (var i = 0; i < trQuatation.length; i++) {
            oldQuatation.TermsAndCondition.push(trQuatation[i]);
        }
        oldQuatation.save((err) => {
            if (err) throw err;
        });
        return res.status(200).json({
            success: true,
            msg: "Quatation Updated",
        }).end();
    } catch (err) {
        return res.status(400).json({
            success: false,
            msg: "Error in creating Quatation. " + err.message,
            data: null,
        });
    }

});

const removeQuatation = asyncHandler(async (req, res) => {
    try {
        const existCustomer = await Quatation.findById(req.params.id);
        if (!existCustomer) {
            return res.status(200).json({
                success: false,
                msg: "Quatation not found."
            });
        }

        const newQuatation = await Quatation.findByIdAndUpdate(req.params.id, {
            is_deleted: true
        });

        return res.status(200).json({
            success: true,
            msg: "Quatation removed. "
        }).end();
    } catch (err) {
        return res.status(400).json({
            success: false,
            msg: "Error in removing Quatation. " + err.message
        });
    }

});

const getAllQuatation = asyncHandler(async (req, res) => {
    try {
        let customerList = await Quatation.find({ is_deleted: false })
            .populate("Customer")
            .populate({
                path: 'Products',
                populate: {
                    path: 'Product',
                }
            })
            .populate("ShippingAddress")
            .populate("TermsAndCondition")
            .populate("BillingAddress")
            .populate("Sales", 'name email')
            .populate("addedBy", 'name email')
            .sort({ createdAt: -1 })
        return res.status(200).json({
            success: true,
            data: customerList
        }).end();
    } catch (err) {
        return res.status(400).json({
            success: false,
            msg: "Error in getting Quatation. " + err.message,
            data: null,
        });
    }
})

const getCustomerById = asyncHandler(async (req, res) => {
    try {
        let customerList = await Quatation.find({ _id: req.params.id })
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
            data: customerList
        }).end();
    } catch (err) {
        return res.status(400).json({
            success: false,
            msg: "Error in getting Quatation. " + err.message,
            data: null,
        });
    }
})

const changeQuatationStatus = asyncHandler(async (req, res) => {
    try {
        const existCustomer = await Quatation.findById(req.body.id);
        if (!existCustomer) {
            return res.status(200).json({
                success: false,
                msg: "Quatation not found."
            });
        }

        const newQuatation = await Quatation.findByIdAndUpdate(req.body.id, {
            Status: req.body.status
        });

        return res.status(200).json({
            success: true,
            msg: "Status updated successfully. "
        }).end();
    } catch (err) {
        return res.status(400).json({
            success: false,
            msg: "Error in changing status. " + err.message
        });
    }
})
const moveToOrder = asyncHandler(async (req, res) => {
    try {
        let quatationExisting = await Quatation.findById(req.params.id).populate("Customer")
            .populate({
                path: 'Products',
                populate: {
                    path: 'Product',
                }
            })
            .populate("ShippingAddress")
            .populate("TermsAndCondition")
            .populate("BillingAddress")
            .populate("Sales", 'name email')
            .populate("addedBy", 'name email')

        if (quatationExisting.Stage == "Order") {
            return res.status(400).json({
                success: false,
                msg: "Quatation already moved to Order. "
            });
        }

        await Quatation.findByIdAndUpdate(req.params.id, {
            Stage: "Order",
        });
        const newOrder = await Order.create({
            Customer: quatationExisting.Customer,
            ShippingAddress: quatationExisting.ShippingAddress,
            BillingAddress: quatationExisting.BillingAddress,
            Status: "New",
            Stage: "New",
            Amount: quatationExisting.Amount,
            CGST: quatationExisting.CGST,
            SGST: quatationExisting.SGST,
            Discount: quatationExisting.Discount,
            TotalTax: quatationExisting.TotalTax,
            TotalPrice: quatationExisting.TotalPrice,
            OrderDate: new Date(),
            // DeliveryDate: quatationExisting.DeliveryDate,
            Sales: quatationExisting.Sales,
            Note: quatationExisting.Note,
            addedBy: req.user._id,
            is_deleted: false
        });
        var products = [];
        for (var i = 0; i < quatationExisting.Products.length; i++) {
            var pr = quatationExisting.Products[i];
            var newPr = {
                OrderId: newOrder._id.toString(),
                Product: pr.Product._id,
                Quantity: pr.Quantity,
                Unit: pr.Unit,
                Price: pr.Price,
                CGST: pr.CGST,
                SGST: pr.SGST,
                Amount: pr.Amount,
                TotalAmount: pr.TotalAmount,
                Note: pr.Note
            }
            products.push(newPr);
        }

        const prOrder = await OrderProduct.create(products);
        for (var i = 0; i < prOrder.length; i++) {
            newOrder.Products.push(prOrder[i]);
        }
        newOrder.save((err) => {
            if (err) throw err;
        });

        return res.status(200).json({
            success: true,
            msg: "Moved to Order successfully",
        }).end();
    } catch (err) {
        return res.status(400).json({
            success: false,
            msg: "Error in moving. " + err.message,
            data: null,
        });
    }

});

const Quatationpdfcreate = asyncHandler(async (req, res) => {
    try {
        const data = await Template.findById(req.body.template_id)
        var template = path.join(__dirname, '..', 'public', 'template.html')
        var templateHtml = fs.readFileSync(template, 'utf8')
        templateHtml = templateHtml.replace('{{Data}}', data.Detail)
        var filename = template.replace('template.html', `Print.pdf`)
        let customerList = await Quatation.find({ is_deleted: false, _id: req.body.id })
            .populate("TermsAndCondition")
            .populate("Customer")
            .populate({
                path: 'Products',
                populate: {
                    path: 'Product',
                }
            })
            .populate("addedBy", 'name email')
        let cmname = customerList[0].Customer?.Title || "";
        if (cmname != "") {
            cmname += ' ' + customerList[0].Customer?.FirstName + ' ' + customerList[0].Customer?.LastName
        }
        let cmaddress = customerList[0].Customer?.Address || "";
        if (cmaddress != "") {
            cmaddress += '<br/>' + customerList[0].Customer?.City + ' ' + customerList[0].Customer?.State
        }
        let termsandcondition = [];
        if (customerList[0].TermsAndCondition.length != 0) {
            let term = customerList[0].TermsAndCondition.map(x => { return '<br/>' + x.condition })
            termsandcondition.push(term)
        }
        else {
            termsandcondition = ''
        }

        templateHtml = templateHtml.replace('{{token.QuatationNo}}', customerList[0].QuatationNo || '')
        templateHtml = templateHtml.replace('{{token.date}}', format('dd-MM-yyyy', customerList[0].QuatationDate))
        templateHtml = templateHtml.replace('{{token.validdate}}', format('dd-MM-yyyy', customerList[0].ValidDate))
        templateHtml = templateHtml.replace('{{token.email}}', customerList[0].Customer?.Email || '')
        templateHtml = templateHtml.replace('{{token.mobile}}', customerList[0].Customer?.Mobile || '')
        templateHtml = templateHtml.replace('{{token.cmaddress}}', cmaddress)
        templateHtml = templateHtml.replace('{{token.cmname}}', cmname)
        templateHtml = templateHtml.replace('{{token.note}}', customerList[0].Note || '')
        templateHtml = templateHtml.replace('{{token.termsandcondition}}', termsandcondition)

        templateHtml = templateHtml.replace('{{token.amount}}', customerList[0].Amount - customerList[0].TotalTax)
        // templateHtml = templateHtml.replace('{{token.cgst}}', customerList[0].CGST || '')
        // templateHtml = templateHtml.replace('{{token.sgst}}', customerList[0].SGST || '')
        // templateHtml = templateHtml.replace('{{token.discount}}', (customerList[0].Amount * customerList[0].Discount) / 100)
        // templateHtml = templateHtml.replace('{{token.finalamount}}', customerList[0].TotalPrice || '')
        // templateHtml = templateHtml.replace('{{token.finalamountword}}', converter.toWords(customerList[0].TotalPrice).toUpperCase())
        templateHtml = templateHtml.replace('{{token.table}}', `<table border="1" cellpadding="10" cellspacing="0" style="width:100%">
        <tbody>
            <tr>
            <th>S No.</th>
            <th>Description</th>
            <th>QTY</th>
            <th>Unit Price</th>
            <th>Unit</th>
            <th>Amount</th>
            </tr>
            ${customerList[0].Products.map((x, i) => (
            `<tr>
            <td style="text-align:center">${i+1}</td>
            <td style="text-align:left"><b>${x.Product?.Name}</b><br/>${x.Product?.Description}</td>
            <td style="text-align:center">${x.Quantity}</td>
            <td style="text-align:center">${x.Price}</td>
            <td style="text-align:center">${x.Unit}</td>
            <td style="text-align:center">${x.Price * x.Quantity}</td>
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
    addQuatation,
    editQuatation,
    removeQuatation,
    getAllQuatation,
    getCustomerById,
    changeQuatationStatus,
    moveToOrder,
    Quatationpdfcreate
}