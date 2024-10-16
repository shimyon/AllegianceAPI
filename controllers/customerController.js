const asyncHandler = require('express-async-handler')
const CustomerModal = require('../models/customerModel')
const Customer = CustomerModal.CustomerModal
const BillingAddress = CustomerModal.BillingAddressModal
const ShippingAddress = CustomerModal.ShippingAddressModal
const Master = require('../models/masterModel')
const ApplicationSetting = Master.ApplicationSettingModal;
const SassMaster = require('../models/saasmasterModel');
const CountryTenant = SassMaster.CountryModal;
const StateTenant = SassMaster.StateModal;
const CityTenant = SassMaster.CityModal;
const ApplicationSettingTenant = SassMaster.ApplicationSettingModal;

const addCustomer = asyncHandler(async (req, res) => {
    try {
        let Customers = Customer(req.conn);
        let ApplicationSetting = ApplicationSettingTenant(req.conn);
        const existCustomerCode = await Customers.findOne({ $or: [{ CustomerCode: req.body.CustomerCode }] });
        if (existCustomerCode) {
            return res.status(200).json({
                success: false,
                msg: "Customer already exist with same Customer code.",
                data: null,
            });
        }
        if (req.body.mobile || req.body.email) {
            const existCustomer = await Customers.findOne({ $or: [{ Mobile: req.body.mobile, Email: req.body.email }] });
            if (existCustomer) {
                return res.status(200).json({
                    success: false,
                    msg: "Customer already exist with same mobile or email.",
                    data: null,
                });
            }
        }
        let customerNo = await Customers.find({}, { CustomerNo: 1, _id: 0 }).sort({ CustomerNo: -1 }).limit(1);
        let maxCustomer = 1;
        if (customerNo.length > 0) {
            maxCustomer = customerNo[0].CustomerNo + 1;
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
        if (applicationSetting.Customer == true) {
            code = req.body.CustomerCode;
        }
        else {
            code = applicationSetting.CustomerPrefix + maxCustomer + `/${financialYearStart}-${financialYearEnd}` + applicationSetting.CustomerSuffix;
        }
        const newCustomer = await Customers.create({
            CustomerNo: maxCustomer || 1,
            CustomerCode: code || "",
            Company: req.body.company,
            GSTNo: req.body.gstno,
            Title: req.body.title,
            FirstName: req.body.firstname,
            LastName: req.body.lastname,
            Designation: req.body.designation,
            Mobile: req.body.mobile,
            Email: req.body.email,
            Address: req.body.address,
            City: req.body.city || null,
            State: req.body.state || null,
            Country: req.body.country || null,
            addedBy: req.user._id,
            Notes: req.body.notes,
            is_active: true
        });
        if (newCustomer) {
            const newBilling = await BillingAddress.create({
                Customer: newCustomer._id,
                Address: req.body.address,
                City: req.body.city||null,
                State: req.body.state||null,
                Country: req.body.country||null,
                is_active: true,
                is_default: true
            });
            const newShipping = await ShippingAddress.create({
                Customer: newCustomer._id,
                Address: req.body.address,
                City: req.body.city||null,
                State: req.body.state||null,
                Country: req.body.country||null,
                addedBy: req.user._id,
                is_active: true,
                is_default: true
            });
            const existCustomer = await Customer.findById(newCustomer._id);
            existCustomer.BillingAddress.push(newBilling);
            existCustomer.ShippingAddress.push(newShipping);
            existCustomer.save((err) => {
                if (err) throw err;
            });
        }
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
        let Customers = Customer(req.conn);

        const existCustomer = await Customers.findById(req.body.id);
        if (!existCustomer) {
            return res.status(200).json({
                success: false,
                msg: "Customer not found.",
                data: null,
            });
        }

        const newCustomer = await Customers.findByIdAndUpdate(req.body.id, {
            Company: req.body.company,
            CustomerCode: req.body.CustomerCode,
            Title: req.body.title,
            GSTNo: req.body.gstno,
            FirstName: req.body.firstname,
            LastName: req.body.lastname,
            Designation: req.body.designation,
            Mobile: req.body.mobile,
            Email: req.body.email,
            Address: req.body.address,
            City: req.body.city || null,
            State: req.body.state || null,
            Country: req.body.country || null,
            addedBy: req.user._id,
            Notes: req.body.notes,
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
    let active = req.body.active == true ? "enabled" : "disabled";
    try {       
        let Customers = Customer(req.conn);

        const existCustomer = await Customers.findById(req.params.id);
        if (!existCustomer) {
            return res.status(200).json({
                success: false,
                msg: "Customer not found.",
                data: null,
            });
        }

        const newCustomer = await Customers.findByIdAndUpdate(req.params.id, {
            is_active: req.body.active
        });

        return res.status(200).json({
            success: true,
            msg: "Customer " + active,
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
        let Country = CountryTenant(req.conn);
        let State = StateTenant(req.conn);
        let City = CityTenant(req.conn);
        let Customers = Customer(req.conn);
        let BillingAddres = BillingAddress(req.conn);
        let ShippingAddres = ShippingAddress(req.conn);
        let customerList = await Customers.find({ is_active: req.body.active }).populate("Country").populate("State").populate("City")
            .populate({
                path: 'BillingAddress',
                populate: [
                    { path: 'Country' },
                    { path: 'State' },
                    { path: 'City' },
                ]
            }).populate({
                path: 'ShippingAddress',
                populate: [
                    { path: 'Country' },
                    { path: 'State' },
                    { path: 'City' }
                ]
            })
            .populate("addedBy", 'name email').sort({ createdAt: -1 })
        const lastCustomerCode = await Customers.find().sort({ createdAt: -1 });
        return res.status(200).json({
            success: true,
            data: customerList,
            lastCustomerCode: lastCustomerCode[0]
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
        let Country = CountryTenant(req.conn);
        let State = StateTenant(req.conn);
        let City = CityTenant(req.conn);
        let Customers = Customer(req.conn);
        let BillingAddres = BillingAddress(req.conn);
        let ShippingAddres = ShippingAddress(req.conn);
        let customerList = await Customers.find({ _id: req.params.id }).populate("Country").populate("State").populate("City")
            .populate({
                path: 'BillingAddress',
                populate: [
                    { path: 'Country' },
                    { path: 'State' },
                    { path: 'City' },
                ]
            }).populate({
                path: 'ShippingAddress',
                populate: [
                    { path: 'Country' },
                    { path: 'State' },
                    { path: 'City' }
                ]
            })
            .populate("addedBy", 'name email')
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
 
        let Customers = Customer(req.conn);
        let BillingAddres = BillingAddress(req.conn);        

        const newBilling = await BillingAddres.create({
            Customer: req.body.customerId,
            Address: req.body.address,
            City: req.body.city || null,
            State: req.body.state || null,
            Country: req.body.country || null,
            is_active: true
        });
        const existCustomer = await Customers.findById(req.body.customerId);
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
               
        let BillingAddres = BillingAddress(req.conn);

        const existBilling = await BillingAddres.findById(req.body.id);
        if (!existBilling) {
            return res.status(200).json({
                success: false,
                msg: "Billing address not found.",
                data: null,
            });
        }

        var newBill = await BillingAddres.findByIdAndUpdate(req.body.id, {
            Address: req.body.address,
            City: req.body.city || null,
            State: req.body.state || null,
            Country: req.body.country || null
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
      
        let BillingAddres = BillingAddress(req.conn);

        await BillingAddres.deleteOne({ _id: req.params.id }).lean().exec((err, doc) => {
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
        
        let Customers = Customer(req.conn);
        let ShippingAddres = ShippingAddress(req.conn);

        const newShipping = await ShippingAddres.create({
            Customer: req.body.customerId,
            Address: req.body.address,
            City: req.body.city || null,
            State: req.body.state || null,
            Country: req.body.country || null,
            addedBy: req.user._id,
            is_active: true
        });
        const existCustomer = await Customers.findById(req.body.customerId);
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
       
        let ShippingAddres = ShippingAddress(req.conn);

        const existShipping = await ShippingAddres.findById(req.body.id);
        if (!existShipping) {
            return res.status(200).json({
                success: false,
                msg: "Shipping address not found.",
                data: null,
            });
        }

        await ShippingAddres.findByIdAndUpdate(req.body.id, {
            Address: req.body.address,
            City: req.body.city || null,
            State: req.body.state || null,
            Country: req.body.country || null,
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
        let ShippingAddres = ShippingAddress(req.conn);

        await ShippingAddres.deleteOne({ _id: req.params.id }).lean().exec((err, doc) => {
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
        let BillingAddres = BillingAddress(req.conn);
        let ShippingAddres = ShippingAddress(req.conn);

        if (req.body.type == "shipping") {
            await ShippingAddres.updateMany({ "Customer": req.body.customerId }, {
                is_default: false
            });
            await ShippingAddres.findByIdAndUpdate(req.body.addressId, {
                is_default: req.body.default
            });
        } else {
            await BillingAddres.updateMany({ "Customer": req.body.customerId }, {
                is_default: false
            });
            await BillingAddres.findByIdAndUpdate(req.body.addressId, {
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