const asyncHandler = require('express-async-handler')
const OrderModal = require('../models/orderModel')
const User = require('../models/userModel')
const notificationModel = require('../models/notificationModel')
const Order = OrderModal.OrderModal
const OrderProduct = OrderModal.OrderProductModal
const QuatationModal = require('../models/quatationModel')
const Quatation = QuatationModal.QuatationModal
const QuatationProduct = QuatationModal.QuatationProductModal
const InvoiceModal = require('../models/invoiceModel')
const Invoice = InvoiceModal.InvoiceModal
const InvoiceProduct = InvoiceModal.InvoiceProductModal
var pdf = require('html-pdf')
var fs = require('fs')
var converter = require('number-to-words')
var format = require('date-format')
var test = require('tape')
var path = require('path')
const Template = require('../models/templateModel')
const { generatePDF } = require('../services/pdfService')

const addOrder = asyncHandler(async (req, res) => {
    try {
        let orderNo = await Order.find({}, { OrderNo: 1, _id: 0 }).sort({ OrderNo: -1 }).limit(1);
        let maxOrder = 1;
        if (orderNo.length > 0) {
            maxOrder = orderNo[0].OrderNo + 1;
        }
        const newOrder = await Order.create({
            OrderNo: maxOrder,
            Customer: req.body.customer,
            ShippingAddress: req.body.shippingAddress||null,
            BillingAddress: req.body.billingAddress||null,
            Status: "New",
            Stage: "New",
            Amount: req.body.amount,
            CGST: req.body.CGST,
            SGST: req.body.SGST,
            Discount: req.body.discount,
            TotalTax: req.body.totalTax,
            TotalPrice: req.body.totalPrice,
            OrderDate: new Date(),
            DeliveryDate: req.body.deliveryDate,
            Sales: req.body.sales,
            Note: req.body.note,
            addedBy: req.user._id,
            is_deleted: false
        });
        var products = [];

        for (var i = 0; i < req.body.products.length; i++) {
            var pr = req.body.products[i];
            var newPr = {
                OrderId: newOrder._id.toString(),
                Product: (pr.product),
                Quantity: pr.quantity,
                Unit: pr.unit,
                Price: pr.price,
                CGST: pr.CGST,
                SGST: pr.SGST,
                TotalAmount: pr.totalAmount,
                Discount: pr.discount,
                Note: pr.note
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
        if (newOrder) {
            let resuser = await User.find({ is_active: true, role: 'Admin' });
            let date = new Date();
            const savedNotification = await notificationModel.create({
                description: `Order(${newOrder.OrderNo}) entry has been created`,
                date: date,
                userId: newOrder.Sales,
                Isread: false
            });
            let insertdata = resuser.map(f => ({
                description: `Order(${newOrder.OrderNo}) entry has been created`,
                date: date,
                userId: f._id,
                Isread: false
            }));
            if (insertdata.length > 0) {
                const savedNotification = await notificationModel.insertMany(insertdata);
            }
            return res.status(200).json(newOrder).end();
        }
        else {
            res.status(400)
            throw new Error("Invalid Order data!")
        }
    } catch (err) {
        return res.status(400).json({
            success: false,
            msg: "Error in creating Order. " + err.message,
            data: null,
        });
    }

});

const editOrder = asyncHandler(async (req, res) => {
    try {
        const oldOrder = await Order.findById(req.body.id);
        if (!oldOrder) {
            return res.status(400).json({
                success: false,
                msg: "Order not found"
            });
        }

        await Order.findByIdAndUpdate(req.body.id, {
            Customer: req.body.customer,
            ShippingAddress: req.body.shippingAddress,
            BillingAddress: req.body.billingAddress,
            Amount: req.body.amount,
            CGST: req.body.CGST,
            SGST: req.body.SGST,
            Discount: req.body.discount,
            TotalTax: req.body.totalTax,
            TotalPrice: req.body.totalPrice,
            DeliveryDate: req.body.deliveryDate,
            Sales: req.body.sales,
            Note: req.body.note
        });

        await OrderProduct.deleteMany({ OrderId: req.body.id }).lean().exec((err, doc) => {
            if (err) {
                return res.status(401).json({
                    success: false,
                    msg: err
                }).end();
            }
        });
        var products = [];

        for (var i = 0; i < req.body.products.length; i++) {
            var pr = req.body.products[i];
            var newPr = {
                OrderId: req.body.id,
                Product: pr.product,
                Quantity: pr.quantity,
                Unit: pr.unit,
                Price: pr.price,
                CGST: pr.CGST,
                SGST: pr.SGST,
                Discount: pr.discount,
                TotalAmount: pr.totalAmount,
                Note: pr.note
            }
            products.push(newPr);
        }

        const prOrder = await OrderProduct.create(products);

        for (var i = 0; i < prOrder.length; i++) {
            oldOrder.Products.push(prOrder[i]);
        }
        oldOrder.save((err) => {
            if (err) throw err;
        });
        return res.status(200).json({
            success: true,
            msg: "Order Updated",
        }).end();
    } catch (err) {
        return res.status(400).json({
            success: false,
            msg: "Error in creating Order. " + err.message,
            data: null,
        });
    }

});

const removeOrder = asyncHandler(async (req, res) => {
    try {
        const existCustomer = await Order.findById(req.params.id);
        if (!existCustomer) {
            return res.status(200).json({
                success: false,
                msg: "Order not found."
            });
        }

        const newOrder = await Order.findByIdAndUpdate(req.params.id, {
            is_deleted: true
        });

        return res.status(200).json({
            success: true,
            msg: "Order removed. "
        }).end();
    } catch (err) {
        return res.status(400).json({
            success: false,
            msg: "Error in removing Order. " + err.message
        });
    }

});

const getAllOrder = asyncHandler(async (req, res) => {
    try {
        let customerList = await Order.find({ is_deleted: false })
            .populate("Customer")
            .populate({
                path: 'Products',
                populate: {
                    path: 'Product',
                }
            })
            .populate("ShippingAddress")
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
            msg: "Error in getting Order. " + err.message,
            data: null,
        });
    }
})

const pdfcreate = asyncHandler(async (req, res) => {
    try {
        const data = await Template.findById(req.body.template_id)
        var template = path.join(__dirname, '..', 'public', 'template.html')
        var templateHtml = fs.readFileSync(template, 'utf8')
        templateHtml = templateHtml.replace('{{Data}}', data.Detail)
        var filename = template.replace('template.html', `Print.pdf`)
        if (data.TemplateFor == 'Order') {
            let customerList = await Order.find({ is_deleted: false, _id: req.body.id })
                .populate("Customer")
                .populate({
                    path: 'Products',
                    populate: {
                        path: 'Product',
                    }
                })
                .populate("ShippingAddress")
                .populate("BillingAddress")
                .populate("Sales", 'name email')
                .populate("addedBy", 'name email')
            templateHtml = templateHtml.replace('{{Data}}', data.Detail || '')
            templateHtml = templateHtml.replace('{{token.company}}', customerList[0].Customer?.Company  || '')
            templateHtml = templateHtml.replace('{{token.OrderNo}}', customerList[0].OrderNo || '')
            templateHtml = templateHtml.replace('{{token.firstname}}', customerList[0].Customer?.FirstName || '')
            templateHtml = templateHtml.replace('{{token.lastname}}', customerList[0].Customer?.LastName || '')
            templateHtml = templateHtml.replace('{{token.email}}', customerList[0].Customer?.Email || '')
            templateHtml = templateHtml.replace('{{token.mobile}}', customerList[0].Customer?.Mobile || '')
            templateHtml = templateHtml.replace('{{token.orderdate}}', format('dd-MM-yyyy', customerList[0].OrderDate))
            templateHtml = templateHtml.replace('{{token.amount}}', customerList[0].Amount - customerList[0].TotalTax)
            templateHtml = templateHtml.replace('{{token.cgst}}', customerList[0].CGST || '')
            templateHtml = templateHtml.replace('{{token.sgst}}', customerList[0].SGST || '')
            templateHtml = templateHtml.replace('{{token.discount}}', (customerList[0].Amount * customerList[0].Discount) / 100)
            templateHtml = templateHtml.replace('{{token.finalamount}}', customerList[0].TotalPrice || '')
            templateHtml = templateHtml.replace('{{token.finalamountword}}', converter.toWords(customerList[0].TotalPrice).toUpperCase())
            templateHtml = templateHtml.replace('{{token.table}}', `<table border="1" cellpadding="10" cellspacing="0" style="width:100%">
            <tbody>
                <tr>
                <th>Item</th>
                <th>Qty</th>
                <th>Unit</th>
                <th>Rate (₹)</th>
                <th>CGST</th>
                <th>SGST</th>
                <th>Total (₹)</th>
                </tr>
                ${customerList[0].Products.map((x, i) => (
                `<tr>
                <td style="text-align:center">${x.Product?.Name}</td>
                <td style="text-align:center">${x.Quantity}</td>
                <td style="text-align:center">${x.Unit}</td>
                <td style="text-align:center">${x.Price}</td>
                <td style="text-align:center">${(x.Price * x.Quantity * x.CGST) / 100} (${x.CGST}%)</td>
                <td style="text-align:center">${(x.Price * x.Quantity * x.SGST) / 100} (${x.SGST}%)</td>
                <td style="text-align:center">${x.TotalAmount}</td>
                </tr>`
            ))}
            </tbody>
            </table>`)
        }
        else if (data.TemplateFor == 'Invoice') {
            let customerList = await Invoice.find({ is_deleted: false, _id: req.body.id })
                .populate("Customer")
                .populate({
                    path: 'Products',
                    populate: {
                        path: 'Product',
                    }
                })
                .populate("ShippingAddress")
                .populate("BillingAddress")
                .populate("addedBy", 'name email')

            let shipcitystate = customerList[0].ShippingAddress?.City || "";
            if (shipcitystate != "") {
                shipcitystate += ',' + customerList[0].ShippingAddress?.State
            }
            let shipaddress = customerList[0].Customer?.Company || "";
            if (shipaddress != "") {
                shipaddress += '<br/>' + customerList[0].Customer?.FirstName + ' ' + customerList[0].Customer?.LastName + '<br/>' + shipcitystate
            }

            let billcitystate = customerList[0].BillingAddress?.City || "";
            if (billcitystate != "") {
                billcitystate += ',' + customerList[0].BillingAddress?.State
            }
            let billaddress = customerList[0].Customer?.Company || "";
            if (billaddress != "") {
                billaddress += '<br/>' + customerList[0].Customer?.FirstName + ' ' + customerList[0].Customer?.LastName + '<br/>' + billcitystate
            }

            templateHtml = templateHtml.replace('{{token.gstno}}', customerList[0].Customer?.GSTNo || '')
            templateHtml = templateHtml.replace('{{token.invoiceno}}', customerList[0].InvoiceNo || '')
            templateHtml = templateHtml.replace('{{token.billemail}}', customerList[0].Customer?.Email || '')
            templateHtml = templateHtml.replace('{{token.shipemail}}', customerList[0].Customer?.Email || '')
            templateHtml = templateHtml.replace('{{token.billmobile}}', customerList[0].Customer?.Mobile || '')
            templateHtml = templateHtml.replace('{{token.shipmobile}}', customerList[0].Customer?.Mobile || '')
            templateHtml = templateHtml.replace('{{token.shipaddress}}', shipaddress)
            templateHtml = templateHtml.replace('{{token.billaddress}}', billaddress)
            templateHtml = templateHtml.replace('{{token.date}}', format('dd-MM-yyyy', customerList[0].InvoiceDate))
            templateHtml = templateHtml.replace('{{token.amount}}', customerList[0].Amount - customerList[0].TotalTax)
            templateHtml = templateHtml.replace('{{token.cgst}}', customerList[0].CGST || '')
            templateHtml = templateHtml.replace('{{token.sgst}}', customerList[0].SGST || '')
            templateHtml = templateHtml.replace('{{token.discount}}', (customerList[0].Amount * customerList[0].Discount) / 100)
            templateHtml = templateHtml.replace('{{token.finalamount}}', customerList[0].TotalPrice || '')
            templateHtml = templateHtml.replace('{{token.finalamountword}}', converter.toWords(customerList[0].TotalPrice).toUpperCase())
            templateHtml = templateHtml.replace('{{token.table}}', `<table border="1" cellpadding="10" cellspacing="0" style="width:100%">
            <tbody>
                <tr>
                <th>Item</th>
                <th>Qty</th>
                <th>Unit</th>
                <th>Rate (₹)</th>
                <th>CGST</th>
                <th>SGST</th>
                <th>Total (₹)</th>
                </tr>
                ${customerList[0].Products.map((x, i) => (
                `<tr>
                <td style="text-align:center">${x.Product?.Name}</td>
                <td style="text-align:center">${x.Quantity}</td>
                <td style="text-align:center">${x.Unit}</td>
                <td style="text-align:center">${x.Price}</td>
                <td style="text-align:center">${(x.Price * x.Quantity * x.CGST) / 100} (${x.CGST}%)</td>
                <td style="text-align:center">${(x.Price * x.Quantity * x.SGST) / 100} (${x.SGST}%)</td>
                <td style="text-align:center">${x.TotalAmount}</td>
                </tr>`
            ))}
            </tbody>
            </table>`)
        }
        else {
            let customerList = await Quatation.find({ is_deleted: false, _id: req.body.id })
                .populate("Customer")
                .populate({
                    path: 'Products',
                    populate: {
                        path: 'Product',
                    }
                })
                .populate("ShippingAddress")
                .populate("BillingAddress")
                .populate("addedBy", 'name email')

                let shipcitystate = customerList[0].ShippingAddress?.City || "";
                if (shipcitystate != "") {
                    shipcitystate += ',' + customerList[0].ShippingAddress?.State
                }
                let shipaddress = customerList[0].Customer?.Company || "";
                if (shipaddress != "") {
                    shipaddress += '<br/>' + customerList[0].Customer?.FirstName + ' ' + customerList[0].Customer?.LastName + '<br/>' + shipcitystate
                }
    
                let billcitystate = customerList[0].BillingAddress?.City || "";
                if (billcitystate != "") {
                    billcitystate += ',' + customerList[0].BillingAddress?.State
                }
                let billaddress = customerList[0].Customer?.Company || "";
                if (billaddress != "") {
                    billaddress += '<br/>' + customerList[0].Customer?.FirstName + ' ' + customerList[0].Customer?.LastName + '<br/>' + billcitystate
                }

            templateHtml = templateHtml.replace('{{token.QuatationNo}}', customerList[0].QuatationNo || '')
            templateHtml = templateHtml.replace('{{token.refno}}', customerList[0].QuatationNo || '')
            templateHtml = templateHtml.replace('{{token.shipaddress}}', shipaddress)
            templateHtml = templateHtml.replace('{{token.billaddress}}', billaddress)
            templateHtml = templateHtml.replace('{{token.billemail}}', customerList[0].Customer?.Email || '')
            templateHtml = templateHtml.replace('{{token.shipemail}}', customerList[0].Customer?.Email || '')
            templateHtml = templateHtml.replace('{{token.billmobile}}', customerList[0].Customer?.Mobile || '')
            templateHtml = templateHtml.replace('{{token.shipmobile}}', customerList[0].Customer?.Mobile || '')
            templateHtml = templateHtml.replace('{{token.date}}', format('dd-MM-yyyy', customerList[0].QuatationDate))
            templateHtml = templateHtml.replace('{{token.validdate}}', format('dd-MM-yyyy', customerList[0].ValidDate))
            templateHtml = templateHtml.replace('{{token.amount}}', customerList[0].Amount - customerList[0].TotalTax)
            templateHtml = templateHtml.replace('{{token.cgst}}', customerList[0].CGST || '')
            templateHtml = templateHtml.replace('{{token.sgst}}', customerList[0].SGST || '')
            templateHtml = templateHtml.replace('{{token.discount}}', (customerList[0].Amount * customerList[0].Discount) / 100)
            templateHtml = templateHtml.replace('{{token.finalamount}}', customerList[0].TotalPrice || '')
            templateHtml = templateHtml.replace('{{token.finalamountword}}', converter.toWords(customerList[0].TotalPrice).toUpperCase())
            templateHtml = templateHtml.replace('{{token.table}}', `<table border="1" cellpadding="10" cellspacing="0" style="width:100%">
            <tbody>
                <tr>
                <th>Item</th>
                <th>Qty</th>
                <th>Unit</th>
                <th>Rate (₹)</th>
                <th>CGST</th>
                <th>SGST</th>
                <th>Total (₹)</th>
                </tr>
                ${customerList[0].Products.map((x, i) => (
                `<tr>
                <td style="text-align:center">${x.Product?.Name}</td>
                <td style="text-align:center">${x.Quantity}</td>
                <td style="text-align:center">${x.Unit}</td>
                <td style="text-align:center">${x.Price}</td>
                <td style="text-align:center">${(x.Price * x.Quantity * x.CGST) / 100} (${x.CGST}%)</td>
                <td style="text-align:center">${(x.Price * x.Quantity * x.SGST) / 100} (${x.SGST}%)</td>
                <td style="text-align:center">${x.TotalAmount}</td>
                </tr>`
            ))}
            </tbody>
            </table>`)
        }

        // pdf.create(templateHtml).toStream(function(err, stream) {
        //     if (err) {
        //         res.end();
        //     } else {
        //         res.set('Content-type', 'application/pdf');
        //         res.setHeader('Content-Disposition', `attachment; filename=Print_${Math.random() * 1000000}.pdf`);
        //         stream.pipe(res)
        //     }
        // });

        const pdfBufferHtml = await generatePDF(templateHtml);
        // res.set('Content-type', 'application/pdf');
        // res.setHeader('Content-Disposition', `attachment; filename=Print_${Math.random() * 1000000}.pdf`);
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

const getOrderById = asyncHandler(async (req, res) => {
    try {
        let customerList = await Order.find({ is_deleted: false, _id: req.params.id })
            .populate("Customer")
            .populate({
                path: 'Products',
                populate: {
                    path: 'Product',
                }
            })
            .populate("ShippingAddress")
            .populate("BillingAddress")
            .populate("Sales", 'name email')
            .populate("addedBy", 'name email')

        return res.status(200).json({
            success: true,
            data: customerList
        });
    } catch (err) {
        return res.status(400).json({
            success: false,
            msg: "Error in getting Order. " + err.message,
            data: null,
        });
    }
})

const changeOrderStatus = asyncHandler(async (req, res) => {
    try {
        const existCustomer = await Order.findById(req.body.id);
        if (!existCustomer) {
            return res.status(200).json({
                success: false,
                msg: "Order not found."
            });
        }

        const newOrder = await Order.findByIdAndUpdate(req.body.id, {
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

const moveToInvoice = asyncHandler(async (req, res) => {
    try {
        let invoiceExisting = await Order.findById(req.params.id)
            .populate("Customer")
            .populate({
                path: 'Products',
                populate: {
                    path: 'Product',
                }
            })
            .populate("ShippingAddress")
            .populate("BillingAddress")
            .populate("Sales", 'name email')
            .populate("addedBy", 'name email')

        if (invoiceExisting.Stage == "Invoice") {
            return res.status(400).json({
                success: false,
                msg: "Order already moved to Invoice. "
            });
        }

        await Order.findByIdAndUpdate(req.params.id, {
            Stage: "Invoice",
        });
        let invoiceNo = await Invoice.find({}, { InvoiceNo: 1, _id: 0 }).sort({ InvoiceNo: -1 }).limit(1);
        let maxInvoice = 1;
        if (invoiceNo.length > 0) {
            maxInvoice = invoiceNo[0].InvoiceNo + 1;
        }
        const newInvoice = await Invoice.create({
            InvoiceNo: maxInvoice,
            Customer: invoiceExisting.Customer,
            ShippingAddress: invoiceExisting.ShippingAddress,
            BillingAddress: invoiceExisting.BillingAddress,
            Stage: "New",
            Amount: invoiceExisting.Amount,
            CGST: invoiceExisting.CGST,
            SGST: invoiceExisting.SGST,
            Discount: invoiceExisting.Discount,
            TotalTax: invoiceExisting.TotalTax,
            TotalPrice: invoiceExisting.TotalPrice,
            DeliveryDate: invoiceExisting.DeliveryDate,
            InvoiceDate: new Date(),
            Sales: invoiceExisting.Sales,
            Note: invoiceExisting.Note,
            addedBy: req.user._id,
            is_deleted: false
        });
        var products = [];
        for (var i = 0; i < invoiceExisting.Products.length; i++) {
            var pr = invoiceExisting.Products[i];
            var newPr = {
                OrderId: newInvoice._id.toString(),
                Product: pr.Product._id,
                Quantity: pr.Quantity,
                Unit: pr.Unit,
                Price: pr.Price,
                CGST: pr.CGST,
                SGST: pr.SGST,
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

        return res.status(200).json({
            success: true,
            msg: "Moved to Invoice successfully",
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
    addOrder,
    editOrder,
    removeOrder,
    getAllOrder,
    getOrderById,
    pdfcreate,
    changeOrderStatus,
    moveToInvoice
}