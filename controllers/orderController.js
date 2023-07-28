const asyncHandler = require('express-async-handler')
const OrderModal = require('../models/orderModel')
const Order = OrderModal.OrderModal
const OrderProduct = OrderModal.OrderProductModal
const QuatationModal = require('../models/quatationModel')
const Quatation = QuatationModal.QuatationModal
const QuatationProduct = QuatationModal.QuatationProductModal
const QuatationTermsandCondition = QuatationModal.QuatationTermsandCondition
const InvoiceModal = require('../models/invoiceModel')
const Invoice = InvoiceModal.InvoiceModal
const InvoiceProduct = InvoiceModal.InvoiceProductModal
const InvoiceTermsandCondition = InvoiceModal.InvoiceTermsandCondition
var pdf = require('html-pdf')
var fs = require('fs')
var converter = require('number-to-words')
var format = require('date-format')
var test = require('tape')
var path = require('path')
const Template = require('../models/templateModel')

const addOrder = asyncHandler(async (req, res) => {
    try {

        const newOrder = await Order.create({
            Customer: req.body.customer,
            ShippingAddress: req.body.shippingAddress,
            BillingAddress: req.body.billingAddress,
            Status: "New",
            Amount: req.body.amount,
            CGST: req.body.CGST,
            SGST: req.body.SGST,
            Discount: req.body.discount,
            TotalTax: req.body.totalTax,
            TotalPrice: req.body.totalPrice,
            OrderDate: new Date(),
            DeliveryDate: req.body.deliveryDate,
            Executive: req.body.executive,
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

        return res.status(200).json(newOrder).end();
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
            Executive: req.body.executive,
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
            .populate("Executive", 'name email')
            .populate("addedBy", 'name email')

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
    const data = await Template.findById(req.body.template_id)
    try {
        var template = path.join(__dirname, 'template.html')
        var templateHtml = fs.readFileSync(template, 'utf8')
        templateHtml = templateHtml.replace('{{Data}}', data.Detail)
        if (data.TemplateFor == 'Order') {
        var filename = template.replace('template.html', `Order_${req.body.id}.pdf`)
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
                .populate("Executive", 'name email')
                .populate("addedBy", 'name email')
            templateHtml = templateHtml.replace('{{Data}}', data.Detail)
            templateHtml = templateHtml.replace('{{token.company}}', customerList[0].Customer?.Company)
            templateHtml = templateHtml.replace('{{token.firstname}}', customerList[0].Customer?.FirstName)
            templateHtml = templateHtml.replace('{{token.lastname}}', customerList[0].Customer?.LastName)
            templateHtml = templateHtml.replace('{{token.email}}', customerList[0].Customer?.Email)
            templateHtml = templateHtml.replace('{{token.mobile}}', customerList[0].Customer?.Mobile)
            templateHtml = templateHtml.replace('{{token.orderdate}}', format('dd-MM-yyyy', customerList[0].OrderDate))
            templateHtml = templateHtml.replace('{{token.amount}}', customerList[0].Amount - customerList[0].TotalTax)
            templateHtml = templateHtml.replace('{{token.cgst}}', customerList[0].CGST)
            templateHtml = templateHtml.replace('{{token.sgst}}', customerList[0].SGST)
            templateHtml = templateHtml.replace('{{token.discount}}', (customerList[0].Amount * customerList[0].Discount) / 100)
            templateHtml = templateHtml.replace('{{token.finalamount}}', customerList[0].TotalPrice)
            templateHtml = templateHtml.replace('{{token.finalamountword}}', converter.toWords(customerList[0].TotalPrice))
            templateHtml = templateHtml.replace('{{token.table}}', `<table border="1" style="width:100%">
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
                <td>${x.Product?.Name}</td>
                <td>${x.Quantity}</td>
                <td>${x.Unit}</td>
                <td>${x.Price}</td>
                <td>${(x.Price*x.Quantity*x.CGST)/100} (${x.CGST}%)</td>
                <td>${(x.Price*x.Quantity*x.SGST)/100} (${x.SGST}%)</td>
                <td>${x.TotalAmount}</td>
                </tr>`
                ))}
            </tbody>
            </table>`)
        }
        else if (data.TemplateFor == 'Invoice') {
        var filename = template.replace('template.html', `Invoice_${req.body.id}.pdf`)
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
            templateHtml = templateHtml.replace('{{token.billcompany}}', customerList[0].Customer?.Company)
            templateHtml = templateHtml.replace('{{token.shipcompany}}', customerList[0].Customer?.Company)
            templateHtml = templateHtml.replace('{{token.billfirstname}}', customerList[0].Customer?.FirstName)
            templateHtml = templateHtml.replace('{{token.shipfirstname}}', customerList[0].Customer?.FirstName)
            templateHtml = templateHtml.replace('{{token.billlastname}}', customerList[0].Customer?.LastName)
            templateHtml = templateHtml.replace('{{token.shiplastname}}', customerList[0].Customer?.LastName)
            templateHtml = templateHtml.replace('{{token.billemail}}', customerList[0].Customer?.Email)
            templateHtml = templateHtml.replace('{{token.shipemail}}', customerList[0].Customer?.Email)
            templateHtml = templateHtml.replace('{{token.billmobile}}', customerList[0].Customer?.Mobile)
            templateHtml = templateHtml.replace('{{token.shipmobile}}', customerList[0].Customer?.Mobile)
            templateHtml = templateHtml.replace('{{token.shipaddress}}', customerList[0].ShippingAddress?.Address)
            templateHtml = templateHtml.replace('{{token.billaddress}}', customerList[0].BillingAddress?.Address)
            templateHtml = templateHtml.replace('{{token.shipcity}}', customerList[0].ShippingAddress?.City)
            templateHtml = templateHtml.replace('{{token.billcity}}', customerList[0].BillingAddress?.City)
            templateHtml = templateHtml.replace('{{token.shipstate}}', customerList[0].ShippingAddress?.State)
            templateHtml = templateHtml.replace('{{token.billstate}}', customerList[0].BillingAddress?.State)
            templateHtml = templateHtml.replace('{{token.date}}', format('dd-MM-yyyy', customerList[0].InvoiceDate))
            templateHtml = templateHtml.replace('{{token.amount}}', customerList[0].Amount - customerList[0].TotalTax)
            templateHtml = templateHtml.replace('{{token.cgst}}', customerList[0].CGST)
            templateHtml = templateHtml.replace('{{token.sgst}}', customerList[0].SGST)
            templateHtml = templateHtml.replace('{{token.discount}}', (customerList[0].Amount * customerList[0].Discount) / 100)
            templateHtml = templateHtml.replace('{{token.finalamount}}', customerList[0].TotalPrice)
            templateHtml = templateHtml.replace('{{token.finalamountword}}', converter.toWords(customerList[0].TotalPrice))
            templateHtml = templateHtml.replace('{{token.table}}', `<table border="1" style="width:100%">
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
                <td>${x.Product?.Name}</td>
                <td>${x.Quantity}</td>
                <td>${x.Unit}</td>
                <td>${x.Price}</td>
                <td>${(x.Price*x.Quantity*x.CGST)/100} (${x.CGST}%)</td>
                <td>${(x.Price*x.Quantity*x.SGST)/100} (${x.SGST}%)</td>
                <td>${x.TotalAmount}</td>
                </tr>`
                ))}
            </tbody>
            </table>`)
        }
        else {
            var filename = template.replace('template.html', `Quatation_${req.body.id}.pdf`)
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

            templateHtml = templateHtml.replace('{{token.billcompany}}', customerList[0].Customer?.Company)
            templateHtml = templateHtml.replace('{{token.shipcompany}}', customerList[0].Customer?.Company)
            templateHtml = templateHtml.replace('{{token.billfirstname}}', customerList[0].Customer?.FirstName)
            templateHtml = templateHtml.replace('{{token.shipfirstname}}', customerList[0].Customer?.FirstName)
            templateHtml = templateHtml.replace('{{token.billlastname}}', customerList[0].Customer?.LastName)
            templateHtml = templateHtml.replace('{{token.shiplastname}}', customerList[0].Customer?.LastName)
            templateHtml = templateHtml.replace('{{token.billemail}}', customerList[0].Customer?.Email)
            templateHtml = templateHtml.replace('{{token.shipemail}}', customerList[0].Customer?.Email)
            templateHtml = templateHtml.replace('{{token.billmobile}}', customerList[0].Customer?.Mobile)
            templateHtml = templateHtml.replace('{{token.shipmobile}}', customerList[0].Customer?.Mobile)
            templateHtml = templateHtml.replace('{{token.shipaddress}}', customerList[0].ShippingAddress?.Address)
            templateHtml = templateHtml.replace('{{token.billaddress}}', customerList[0].BillingAddress?.Address)
            templateHtml = templateHtml.replace('{{token.shipcity}}', customerList[0].ShippingAddress?.City)
            templateHtml = templateHtml.replace('{{token.billcity}}', customerList[0].BillingAddress?.City)
            templateHtml = templateHtml.replace('{{token.shipstate}}', customerList[0].ShippingAddress?.State)
            templateHtml = templateHtml.replace('{{token.billstate}}', customerList[0].BillingAddress?.State)
            templateHtml = templateHtml.replace('{{token.date}}', format('dd-MM-yyyy', customerList[0].QuatationDate))
            templateHtml = templateHtml.replace('{{token.validdate}}', format('dd-MM-yyyy', customerList[0].ValidDate))
            templateHtml = templateHtml.replace('{{token.amount}}', customerList[0].Amount - customerList[0].TotalTax)
            templateHtml = templateHtml.replace('{{token.cgst}}', customerList[0].CGST)
            templateHtml = templateHtml.replace('{{token.sgst}}', customerList[0].SGST)
            templateHtml = templateHtml.replace('{{token.discount}}', (customerList[0].Amount * customerList[0].Discount) / 100)
            templateHtml = templateHtml.replace('{{token.finalamount}}', customerList[0].TotalPrice)
            templateHtml = templateHtml.replace('{{token.finalamountword}}', converter.toWords(customerList[0].TotalPrice))
            templateHtml = templateHtml.replace('{{token.table}}', `<table border="1" style="width:100%">
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
                <td>${x.Product?.Name}</td>
                <td>${x.Quantity}</td>
                <td>${x.Unit}</td>
                <td>${x.Price}</td>
                <td>${(x.Price*x.Quantity*x.CGST)/100} (${x.CGST}%)</td>
                <td>${(x.Price*x.Quantity*x.SGST)/100} (${x.SGST}%)</td>
                <td>${x.TotalAmount}</td>
                </tr>`
                ))}
            </tbody>
            </table>`)
        }
        pdf
            .create(templateHtml)
            .toFile(filename, function (err, pdf) {
                return res.status(400).json({
                    error: err,
                    data: pdf.filename,
                });
            })
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
            .populate("Executive", 'name email')
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

module.exports = {
    addOrder,
    editOrder,
    removeOrder,
    getAllOrder,
    getOrderById, pdfcreate,
    changeOrderStatus
}