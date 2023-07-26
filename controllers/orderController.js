const asyncHandler = require('express-async-handler')
const OrderModal = require('../models/orderModel')
const Order = OrderModal.OrderModal
const OrderProduct = OrderModal.OrderProductModal
var pdf = require('html-pdf')
var fs = require('fs')
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
    const data = await Template.findById(req.params.id)
    try {
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

        var template = path.join(__dirname, 'card.html')
        var filename = template.replace('.html', '.pdf')
        var templateHtml = fs.readFileSync(template, 'utf8')
        templateHtml = templateHtml.replace('{{image}}', data.Detail)
        templateHtml = templateHtml.replace('{{order.company}}', customerList[0].Customer?.Company)
        templateHtml = templateHtml.replace('{{order.firstname}}', customerList[0].Customer?.FirstName)
        templateHtml = templateHtml.replace('{{order.lastname}}', customerList[0].Customer?.LastName)
        templateHtml = templateHtml.replace('{{order.email}}', customerList[0].Customer?.Email)
        templateHtml = templateHtml.replace('{{order.mobile}}', customerList[0].Customer?.Mobile)
        templateHtml = templateHtml.replace('{{order.orderdate}}', customerList[0].OrderDate)

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
            msg: "Error in getting Order. " + err.message,
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