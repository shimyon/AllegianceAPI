const asyncHandler = require('express-async-handler')
const QuatationModal = require('../models/quatationModel')
const Quatation = QuatationModal.QuatationModal
const QuatationProduct = QuatationModal.QuatationProductModal
const QuatationTermsandCondition = QuatationModal.QuatationTermsandCondition
const OrderModal = require('../models/orderModel')
const Order = OrderModal.OrderModal
const OrderProduct = OrderModal.OrderProductModal

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
            ShippingAddress: req.body.shippingAddress,
            BillingAddress: req.body.billingAddress,
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

        return res.status(200).json(newQuatation).end();
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
module.exports = {
    addQuatation,
    editQuatation,
    removeQuatation,
    getAllQuatation,
    getCustomerById,
    changeQuatationStatus,
    moveToOrder
}