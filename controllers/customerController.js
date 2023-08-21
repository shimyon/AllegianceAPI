const asyncHandler = require('express-async-handler')
const CustomerModal = require('../models/customerModel')
const Customer = CustomerModal.CustomerModal
const BillingAddress = CustomerModal.BillingAddressModal
const ShippingAddress = CustomerModal.ShippingAddressModal


const addCustomer = asyncHandler(async (req, res) => {
    try {
        const existCustomer = await Customer.findOne({ $or: [{ Mobile: req.body.mobile, Email: req.body.email }] });
        if (existCustomer) {
            return res.status(200).json({
                success: false,
                msg: "Customer already exist with same mobile or email.",
                data: null,
            });
        }
        const newCustomer = await Customer.create({
            Company: req.body.company,
            GSTNo: req.body.gstno,
            Title: req.body.title,
            FirstName: req.body.firstname,
            LastName: req.body.lastname,
            Designation: req.body.designation,
            Mobile: req.body.mobile,
            Email: req.body.email,
            Address: req.body.address,
            City: req.body.city,
            State: req.body.state,
            Country: req.body.country,
            addedBy: req.user._id,
            Notes:req.body.notes,
            is_active: true
        });

        return res.status(200).json(newCustomer).end();
    } catch (err) {
        return res.status(400).json({
            success: false,
            msg: "Error in creating Customer. " + err.message,
            data: null,
        });
    }

});

const editCustomer = asyncHandler(async (req, res) => {
    try {
        const existCustomer = await Customer.findById(req.body.id);
        if (!existCustomer) {
            return res.status(200).json({
                success: false,
                msg: "Customer not found.",
                data: null,
            });
        }

        const newCustomer = await Customer.findByIdAndUpdate(req.body.id, {
            Company: req.body.company,
            Title: req.body.title,
            GSTNo: req.body.gstno,
            FirstName: req.body.firstname,
            LastName: req.body.lastname,
            Designation: req.body.designation,
            Mobile: req.body.mobile,
            Email: req.body.email,
            Address: req.body.address,
            City: req.body.city,
            State: req.body.state,
            Country: req.body.country,
            addedBy: req.user._id,
            Notes:req.body.notes,
            is_active: true
        });

        return res.status(200).json({
            success: true,
            msg: "Customer Updated. ",
            data: null
        }).end();
    } catch (err) {
        return res.status(400).json({
            success: false,
            msg: "Error in updating Customer. " + err.message,
            data: null,
        });
    }

});

const removeCustomer = asyncHandler(async (req, res) => {
    let active= req.body.active== true?"enabled":"disabled";
    try {
        const existCustomer = await Customer.findById(req.params.id);
        if (!existCustomer) {
            return res.status(200).json({
                success: false,
                msg: "Customer not found.",
                data: null,
            });
        }

        const newCustomer = await Customer.findByIdAndUpdate(req.params.id, {
            is_active: req.body.active
        });
        
        return res.status(200).json({
            success: true,
            msg: "Customer "+active,
            data: null
        }).end();
    } catch (err) {
        return res.status(400).json({
            success: false,
            msg: "Error in process. " + err.message,
            data: null,
        });
    }

});

const getAllCustomer = asyncHandler(async (req, res) => {
    try {
        let customerList = await Customer.find({ is_active: req.body.active }).populate("BillingAddress").populate("ShippingAddress").populate("addedBy", 'name email')
        return res.status(200).json({
            success: true,
            data: customerList
        }).end();
    } catch (err) {
        return res.status(400).json({
            success: false,
            msg: "Error in getting customer. " + err.message,
            data: null,
        });
    }
})
const getCustomerById = asyncHandler(async (req, res) => {
    try {
        let customerList = await Customer.find({ _id: req.params.id }).populate("BillingAddress").populate("ShippingAddress").populate("addedBy", 'name email')
        return res.status(200).json({
            success: true,
            data: customerList
        }).end();
    } catch (err) {
        return res.status(400).json({
            success: false,
            msg: "Error in getting customer. " + err.message,
            data: null,
        });
    }
})


const addBillingAddress = asyncHandler(async (req, res) => {
    try {
        const newBilling = await BillingAddress.create({
            Customer: req.body.customerId,
            Address: req.body.address,
            City: req.body.city,
            State: req.body.state,
            Country: req.body.country,
            is_active: true
        });
        const existCustomer = await Customer.findById(req.body.customerId);
        existCustomer.BillingAddress.push(newBilling);
        existCustomer.save((err) => {
            if (err) throw err;
        });
        return res.status(200).json(newBilling).end();
    } catch (err) {
        return res.status(400).json({
            success: false,
            msg: "Error in creating Billing Address. " + err.message,
            data: null,
        });
    }

});

const editBillingAddress = asyncHandler(async (req, res) => {
    try {
        const existBilling = await BillingAddress.findById(req.body.id);
        if (!existBilling) {
            return res.status(200).json({
                success: false,
                msg: "Billing address not found.",
                data: null,
            });
        }

        var newBill = await BillingAddress.findByIdAndUpdate(req.body.id, {
            Address: req.body.address,
            City: req.body.city,
            State: req.body.state,
            Country: req.body.country
        });

        return res.status(200).json({
            success: true,
            msg: "Billing Address Updated. ",
            data: null
        }).end();
    } catch (err) {
        return res.status(400).json({
            success: false,
            msg: "Error in updating billing. " + err.message,
            data: null,
        });
    }

});

const removeBillingAddress = asyncHandler(async (req, res) => {
    try {
        await BillingAddress.deleteOne({ _id: req.params.id }).lean().exec((err, doc) => {
            if (err) {
                return res.status(401).json({
                    success: false,
                    msg: err
                }).end();
            } else {
                return res.status(200).json({
                    success: true,
                    msg: "Billing removed. ",
                }).end();
            }
        });

    } catch (err) {
        return res.status(400).json({
            success: false,
            msg: "Error in removing Billing. " + err.message,
            data: null,
        });
    }

});

const addShippingAddress = asyncHandler(async (req, res) => {
    try {
        const newShipping = await ShippingAddress.create({
            Customer: req.body.customerId,
            Address: req.body.address,
            City: req.body.city,
            State: req.body.state,
            Country: req.body.country,
            addedBy: req.user._id,
            is_active: true
        });
        const existCustomer = await Customer.findById(req.body.customerId);
        existCustomer.ShippingAddress.push(newShipping);
        existCustomer.save((err) => {
            if (err) throw err;
        });
        return res.status(200).json(newShipping).end();
    } catch (err) {
        return res.status(400).json({
            success: false,
            msg: "Error in creating Customer. " + err.message,
            data: null,
        });
    }

});

const editShippingAddress = asyncHandler(async (req, res) => {
    try {
        const existShipping = await ShippingAddress.findById(req.body.id);
        if (!existShipping) {
            return res.status(200).json({
                success: false,
                msg: "Shipping address not found.",
                data: null,
            });
        }

        await ShippingAddress.findByIdAndUpdate(req.body.id, {
            Address: req.body.address,
            City: req.body.city,
            State: req.body.state,
            Country: req.body.country,
            addedBy: req.user._id,
        });

        return res.status(200).json({
            success: true,
            msg: "Shipping Address Updated. ",
            data: null
        }).end();
    } catch (err) {
        return res.status(400).json({
            success: false,
            msg: "Error in updating Shipping. " + err.message,
            data: null,
        });
    }

});

const removeShippingAddress = asyncHandler(async (req, res) => {
    try {
        await ShippingAddress.deleteOne({ _id: req.params.id }).lean().exec((err, doc) => {
            if (err) {
                return res.status(401).json({
                    success: false,
                    msg: err
                }).end();
            } else {
                return res.status(200).json({
                    success: true,
                    msg: "Shipping removed. ",
                }).end();
            }
        });
    } catch (err) {
        return res.status(400).json({
            success: false,
            msg: "Error in removing Shipping. " + err.message,
            data: null,
        });
    }

});

const setDefaultAddress = asyncHandler(async (req, res) => {
    try {
        if (req.body.type == "shipping") {
            await ShippingAddress.updateMany({"Customer":req.body.customerId}, {
                is_default: false
            });
            await ShippingAddress.findByIdAndUpdate(req.body.addressId, {
                is_default: req.body.default
            });
        } else {
            await BillingAddress.updateMany({"Customer":req.body.customerId}, {
                is_default: false
            });
            await BillingAddress.findByIdAndUpdate(req.body.addressId, {
                is_default: req.body.default
            });
        }

        return res.status(200).json({
            success: true,
            msg: "Default address set"
        });
    } catch (err) {
        return res.status(400).json({
            success: false,
            msg: "Error in removing Shipping. " + err.message,
            data: null,
        });
    }

});

module.exports = {
    addCustomer,
    editCustomer,
    removeCustomer,
    addBillingAddress,
    editBillingAddress,
    removeBillingAddress,
    addShippingAddress,
    editShippingAddress,
    removeShippingAddress,
    getAllCustomer,
    getCustomerById,
    setDefaultAddress
}