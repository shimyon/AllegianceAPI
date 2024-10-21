const asyncHandler = require('express-async-handler')
const QuatationModal = require('../models/quatationModel')
const User = require('../models/userModel')
const Notification = require('../models/notificationModel')
const Quatations = QuatationModal.QuatationModal
const QuatationProducts = QuatationModal.QuatationProductModal
const OrderModal = require('../models/orderModel')
const Orders = OrderModal.OrderModal
const OrderProducts = OrderModal.OrderProductModal
const SassMaster = require('../models/saasmasterModel');
const ApplicationSettings = SassMaster.ApplicationSettingModal;
const Statuss = SassMaster.StatusModal;
const Products = SassMaster.ProductModal;
const Units = SassMaster.UnitModal;
const Countrys = SassMaster.CountryModal;
const States = SassMaster.StateModal;
const Citys = SassMaster.CityModal;
const Icons = SassMaster.IconModal;
const LeadModal = require('../models/leadModel');
const Leads = LeadModal.LeadsModal;
const CustomerModal = require('../models/customerModel');
const Customer = CustomerModal.CustomerModal;
const BillingAddress = CustomerModal.BillingAddressModal;
const ShippingAddress = CustomerModal.ShippingAddressModal;

var pdf = require('html-pdf')
var fs = require('fs')
var converter = require('number-to-words')
var format = require('date-format')
var test = require('tape')
var path = require('path')
const Templates = require('../models/templateModel')
const { generatePDF } = require('../services/pdfService')
const addQuatation = asyncHandler(async (req, res) => {
    try {
        let Quatation = Quatations(req.conn);
        let QuatationProduct = QuatationProducts(req.conn);
        let ApplicationSetting = ApplicationSettings(req.conn);
        let notificationModel = Notification(req.conn);

        const existQuatationCode = await Quatation.findOne({ $or: [{ QuatationCode: req.body.QuatationCode }] });
        if (existQuatationCode) {
            return res.status(200).json({
                success: false,
                msg: "Quatation already exist with same Quatation code.",
                data: null,
            });
        }
        let quatationNo = await Quatation.find({}, { QuatationNo: 1, _id: 0 }).sort({ QuatationNo: -1 }).limit(1);
        let maxQuatation = 1;
        if (quatationNo.length > 0) {
            maxQuatation = quatationNo[0].QuatationNo + 1;
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
        if (applicationSetting.Quotation == true) {
            code = req.body.QuatationCode;
        }
        else {
            code = applicationSetting.QuotationPrefix + maxQuatation + `/${financialYearStart}-${financialYearEnd}` + applicationSetting.QuotationSuffix;
        }
        const newQuatation = await Quatation.create({
            QuatationNo: maxQuatation,
            QuatationCode: code,
            Customer: req.body.customer,
            QuatationName: req.body.QuatationName,
            Descriptionofwork: req.body.Descriptionofwork,
            ShippingAddress: req.body.shippingAddress || null,
            BillingAddress: req.body.billingAddress || null,
            Status: "New",
            Stage: "New",
            Sales: req.body.sales,
            addedBy: req.user._id,
            BeforeTaxPrice: req.body.BeforeTaxPrice,
            CGST: req.body.CGST,
            SGST: req.body.SGST,
            TermsAndCondition: req.body.TermsAndCondition,
            OtherChargeName: req.body.OtherChargeName,
            OtherCharge: req.body.OtherCharge,
            Discount: req.body.discount,
            TotalTax: req.body.totalTax,
            AfterTaxPrice: req.body.AfterTaxPrice,
            FinalPrice: req.body.finalPrice,
            RoundOff: req.body.RoundOff,
            Amount: req.body.Amount,
            QuatationDate: req.body.quatattionDate,
            ValidDate: req.body.vaidDate,
            Note: req.body.note,
            is_deleted: false
        });

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
                TotalAmount: pr.TotalAmount,
                FinalAmount: pr.FinalAmount,
                Note: pr.note
            }
            products.push(newPr);
        }

        const prQuatation = await QuatationProduct.create(products);
        for (var i = 0; i < prQuatation.length; i++) {
            newQuatation.Products.push(prQuatation[i]);
        }

        newQuatation.save((err) => {
            if (err) throw err;
        });
        if (newQuatation) {
            let date = new Date();
            const savedNotification = await notificationModel.create({
                description: `Quatation(${newQuatation.QuatationCode}) entry has been created`,
                date: date,
                link: "Quotes",
                userId: newQuatation.Sales,
                Isread: false
            });
            // let resuser = await User.find({ is_active: true, role: 'SuperAdmin' });
            // let insertdata = resuser.map(f => ({
            //     description: `Quatation(${newQuatation.QuatationCode}) entry has been created`,
            //     date: date,
            //     link: "Quotes",
            //     userId: f._id,
            //     Isread: false
            // }));
            // if (insertdata.length > 0) {
            //     const savedNotification = await notificationModel.insertMany(insertdata);
            // }
            return res.status(200).json({
                success: true,
                msg: "Quatation Added",
            }).end();
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
        let Quatation = Quatations(req.conn);
        let QuatationProduct = QuatationProducts(req.conn); 

        const oldQuatation = await Quatation.findById(req.body.id);
        if (!oldQuatation) {
            return res.status(400).json({
                success: false,
                msg: "Quatation not found"
            });
        }

        await Quatation.findByIdAndUpdate(req.body.id, {
            Customer: req.body.customer,
            QuatationCode: req.body.QuatationCode,
            QuatationName: req.body.QuatationName,
            Descriptionofwork: req.body.Descriptionofwork,
            ShippingAddress: req.body.shippingAddress,
            BillingAddress: req.body.billingAddress,
            Sales: req.body.sales,
            addedBy: req.user._id,
            BeforeTaxPrice: req.body.BeforeTaxPrice,
            CGST: req.body.CGST,
            SGST: req.body.SGST,
            OtherChargeName: req.body.OtherChargeName,
            TermsAndCondition: req.body.TermsAndCondition,
            OtherCharge: req.body.OtherCharge,
            Discount: req.body.discount,
            TotalTax: req.body.totalTax,
            AfterTaxPrice: req.body.AfterTaxPrice,
            FinalPrice: req.body.finalPrice,
            RoundOff: req.body.RoundOff,
            Amount: req.body.Amount,
            QuatationDate: req.body.quatattionDate,
            ValidDate: req.body.vaidDate,
            Note: req.body.note,
        });

        await QuatationProduct.deleteMany({ QuatationId: req.body.id }).lean()

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
                TotalAmount: pr.TotalAmount,
                FinalAmount: pr.FinalAmount,
                Note: pr.note
            }
            products.push(newPr);
        }

        const prQuatation = await QuatationProduct.create(products);

        for (var i = 0; i < prQuatation.length; i++) {
            oldQuatation.Products.push(prQuatation[i]);
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
        let Quatation = Quatations(req.conn);        

        const existQuatation = await Quatation.findById(req.params.id);
        if (!existQuatation) {
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
        let Quatation = Quatations(req.conn);

        let { skip, per_page } = req.body;
        let query = [];
        query.push({
            $match: { is_deleted: req.body.active }
        });
        query.push(
            {
                '$lookup': {
                    'from': 'customers',
                    'localField': 'Customer',
                    'foreignField': '_id',
                    'as': 'Customer'
                }
            },
            {
                $unwind: {
                    path: '$Customer'
                },
            },
            {
                $sort: { createdAt: -1 }
            }
        );

        if (req.body.filter) {
            query.push(
                {
                    $match: { "Customer.Company": { $regex: new RegExp(req.body.filter, "i") } },
                });
        }
        query.push(
            {
                $facet: {
                    stage1: [
                        {
                            $group: {
                                _id: null,
                                count: {
                                    $sum: 1,
                                },
                            },
                        },
                    ],
                    stage2: [
                        {
                            $skip: skip,
                        },
                        {
                            $limit: per_page,
                        },
                    ],
                },
            },
            {
                $unwind: {
                    path: '$stage1'
                },
            },
            {
                $project: {
                    count: "$stage1.count",
                    data: "$stage2",
                },
            }
        )
        const lastQuationCode = await Quatation.find().sort({createdAt: -1});
        const quatationList = await Quatation.aggregate(query).exec();
        if (quatationList.length == 0) {
            return res.status(200).json({
                success: true,
                data: { Count: 0, data: [] }
            }).end();
        }
        else {
            return res.status(200).json({
                success: true,
                data: quatationList[0],
                lastQuationCode: lastQuationCode[0],
            }).end();
        }
    } catch (err) {
        return res.status(400).json({
            success: false,
            msg: "Error in getting Quatation. " + err.message,
            data: null,
        });
    }
})

const getQuatationById = asyncHandler(async (req, res) => {
    try {
        let Quatation = Quatations(req.conn);
        let QuatationProduct = QuatationProducts(req.conn);
        let Customers = Customer(req.conn);
        let BillingAddresss = BillingAddress(req.conn);
        let ShippingAddresss = ShippingAddress(req.conn)
        let Users = User(req.conn);

        let QuatationList = await Quatation.find({ _id: req.params.id })
            .populate("Customer")
            .populate("Products")
            .populate("ShippingAddress")
            .populate("BillingAddress")
            .populate("Sales", 'name email')
            .populate("addedBy", 'name email')

        return res.status(200).json({
            success: true,
            data: QuatationList
        }).end();
    } catch (err) {
        return res.status(400).json({
            success: false,
            msg: "Error in getting Quatation. " + err.message,
            data: null,
        });
    }
})

const moveToOrder = asyncHandler(async (req, res) => {
    try {
        let Quatation = Quatations(req.conn);
        let QuatationProduct = QuatationProducts(req.conn);
        let Customers = Customer(req.conn);
        let BillingAddresss = BillingAddress(req.conn);
        let ShippingAddresss = ShippingAddress(req.conn);
        let Users = User(req.conn);
        let ApplicationSetting = ApplicationSettings(req.conn);
        let Status = Statuss(req.conn);
        let Order = Orders(req.conn);
        let OrderProduct = OrderProducts(req.conn);

        let quatationExisting = await Quatation.findById(req.params.id).populate("Customer")
            .populate("Products")
            .populate("ShippingAddress")
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

        let orderNo = await Order.find({}, { OrderNo: 1, _id: 0 }).sort({ OrderNo: -1 }).limit(1);
        let maxOrder = 1;
        if (orderNo.length > 0) {
            maxOrder = orderNo[0].OrderNo + 1;
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
        if (applicationSetting.Order == true) {
            code = quatationExisting.QuatationCode;
        }
        else {
            code = applicationSetting.OrderPrefix + maxOrder + `/${financialYearStart}-${financialYearEnd}` + applicationSetting.OrderSuffix;
        }
        let status = await Status.find({GroupName:"Orders"}).lean();
        const newOrder = await Order.create({
            OrderNo: maxOrder,
            OrderCode: code,
            Customer: quatationExisting.Customer,
            QuatationId: quatationExisting._id,
            OrderName: quatationExisting.QuatationName,
            Descriptionofwork: quatationExisting.Descriptionofwork,
            ShippingAddress: quatationExisting.ShippingAddress,
            BillingAddress: quatationExisting.BillingAddress,
            Status: status[0],
            Stage: "New",
            Sales: quatationExisting.Sales,
            addedBy: req.user._id,
            BeforeTaxPrice: quatationExisting.BeforeTaxPrice,
            CGST: quatationExisting.CGST,
            SGST: quatationExisting.SGST,
            TermsAndCondition: quatationExisting.TermsAndCondition,
            OtherChargeName: quatationExisting.OtherChargeName,
            OtherCharge: quatationExisting.OtherCharge,
            Discount: quatationExisting.Discount,
            TotalTax: quatationExisting.TotalTax,
            AfterTaxPrice: quatationExisting.AfterTaxPrice,
            FinalPrice: quatationExisting.FinalPrice,
            RoundOff: quatationExisting.RoundOff,
            Amount: quatationExisting.Amount,
            DeliveryDate: quatationExisting.QuatationDate,
            Note: quatationExisting.Note,
            is_deleted: false
        });
        var products = [];
        for (var i = 0; i < quatationExisting.Products.length; i++) {
            var pr = quatationExisting.Products[i];
            var newPr = {
                OrderId: newOrder._id.toString(),
                Product: pr.Product,
                Quantity: pr.Quantity,
                Unit: pr.Unit,
                Price: pr.Price,
                CGST: pr.CGST,
                SGST: pr.SGST,
                TotalAmount: pr.TotalAmount,
                FinalAmount: pr.FinalAmount,
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
        let Quatation = Quatations(req.conn);
        let QuatationProduct = QuatationProducts(req.conn);
        let Customers = Customer(req.conn);
        let Unit = Units(req.conn);
        let Product = Products(req.conn);        
        let Users = User(req.conn);
        let ApplicationSetting = ApplicationSettings(req.conn);
        let Template = Templates(req.conn);

        const data = await Template.findById(req.body.template_id)
        var template = path.join(__dirname, '..', 'public', 'template.html')
        var templateHtml = fs.readFileSync(template, 'utf8')
        templateHtml = templateHtml.replace('{{Data}}', data.Detail)
        var filename = template.replace('template.html', `Print.pdf`)
        let applicationSetting = await ApplicationSetting.findOne();
        let customerList = await Quatation.find({ is_deleted: false, _id: req.body.id })
            .populate("Customer")
            .populate("QuatationName")
            .populate({
                path: 'Products',
                populate: [
                    { path: 'Product' },
                    { path: 'Unit' }
                ]
            })
            .populate("addedBy", 'name email')
        let cmname = customerList[0].Customer?.Title + ' ' + customerList[0].Customer?.FirstName + ' ' + customerList[0].Customer?.LastName;
        let cmaddress = customerList[0].Customer?.Address + ' ' + '<br/>' + customerList[0].Customer?.City + ' ' + customerList[0].Customer?.State;
        let extraChargeRow = '';
        if (customerList[0].OtherCharge && customerList[0].OtherCharge !== 0) {
            extraChargeRow = `
    <tr>
        <td style="font-size: 11px;text-align:center"></td>
        <td style="font-size: 11px;text-align:left" colspan="4">Extra Charge: ${customerList[0].OtherChargeName}</td>
        <td style="font-size: 11px;text-align:center">${customerList[0].OtherCharge}</td>
    </tr>`;
        }
        templateHtml = templateHtml.replace('{{token.companytitle}}', applicationSetting.CompanyTitle || '')
        templateHtml = templateHtml.replace('{{token.companysubtitle}}', applicationSetting.CompanySubTitle || '')
        templateHtml = templateHtml.replace('{{token.OfficeEmail}}', applicationSetting.OfficeEmail || '')
        templateHtml = templateHtml.replace('{{token.OfficePhone1}}', applicationSetting.OfficePhone1 || '')
        templateHtml = templateHtml.replace('{{token.PanNo}}', applicationSetting.PanNo || '')
        templateHtml = templateHtml.replace('{{token.GSTNo}}', applicationSetting.GSTNo || '')
        templateHtml = templateHtml.replace('{{token.bankname}}', applicationSetting.BankName || '')
        templateHtml = templateHtml.replace('{{token.ifsc}}', applicationSetting.IFSCNo || '')
        templateHtml = templateHtml.replace('{{token.accno}}', applicationSetting.AccNo || '')
        templateHtml = templateHtml.replace('{{token.OfficePhone2}}', applicationSetting.OfficePhone2 || '')
        templateHtml = templateHtml.replace('{{token.OfficeAddress}}', applicationSetting.OfficeAddress?.replace(/(\r\n|\n|\r)/gm, "<br>") || '')
        templateHtml = templateHtml.replace('{{token.QuatationName}}', customerList[0].QuatationName?.Name || '')
        templateHtml = templateHtml.replace('{{token.QuatationNo}}', customerList[0].QuatationCode || '')
        templateHtml = templateHtml.replace('{{token.CustomerNo}}', customerList[0].Customer?.CustomerCode || '')
        templateHtml = templateHtml.replace('{{token.date}}', format('dd-MM-yyyy', customerList[0].QuatationDate))
        templateHtml = templateHtml.replace('{{token.validdate}}', format('dd-MM-yyyy', customerList[0].ValidDate))
        templateHtml = templateHtml.replace('{{token.email}}', customerList[0].Customer?.Email || '')
        templateHtml = templateHtml.replace('{{token.cmgst}}', customerList[0].Customer?.GSTNo || '')
        templateHtml = templateHtml.replace('{{token.mobile}}', customerList[0].Customer?.Mobile || '')
        templateHtml = templateHtml.replace('{{token.cmaddress}}', cmaddress)
        templateHtml = templateHtml.replace('{{token.cmcompany}}', customerList[0].Customer?.Company)
        templateHtml = templateHtml.replace('{{token.cmname}}', cmname)
        templateHtml = templateHtml.replace('{{token.cmfirstname}}', customerList[0].Customer?.FirstName)
        templateHtml = templateHtml.replace('{{token.termsandcondition}}', customerList[0].TermsAndCondition || '')
        templateHtml = templateHtml.replace('{{token.BeforeTaxPrice}}', customerList[0].BeforeTaxPrice || '0')
        templateHtml = templateHtml.replace('{{token.Price}}', customerList[0].BeforeTaxPrice + customerList[0].OtherCharge)
        templateHtml = templateHtml.replace('{{token.AfterTaxPrice}}', customerList[0].AfterTaxPrice || '0')
        templateHtml = templateHtml.replace('{{token.cgst}}', customerList[0].CGST || '0')
        templateHtml = templateHtml.replace('{{token.sgst}}', customerList[0].SGST || '0')
        templateHtml = templateHtml.replace('{{token.discount}}', (customerList[0].AfterTaxPrice * customerList[0].Discount) / 100)
        templateHtml = templateHtml.replace('{{token.finalamount}}', customerList[0].FinalPrice || '0')
        templateHtml = templateHtml.replace('{{token.roundoff}}', customerList[0].RoundOff || '0')
        templateHtml = templateHtml.replace('{{token.finalamountword}}', converter.toWords(customerList[0].FinalPrice).toUpperCase())
        templateHtml = templateHtml.replace('{{token.table}}', `<table border="1" bordercolor="#ccc" cellpadding="3" cellspacing="3"
        style="border-collapse:collapse;border-left:revert-layer;border-right:revert-layer;width:100%">
        <tbody>
        <tr style="background-color: #FFC000;">
        <th style="font-size: 11px;text-align:left" colspan="7"><strong>DESCRIPTION OF WORK<strong></td>
            </tr>
            <tr>
            <td style="font-size: 11px;text-align:left" colspan="7">${customerList[0].Descriptionofwork?.replace(/(\r\n|\n|\r)/gm, "<br>")}</td>
            </tr>
        <tr style="background-color: #FFC000;">
            <th style="font-size: 11px;">S No.</th>
            <th style="font-size: 11px;">Description</th>
            <th style="font-size: 11px;">Unit</th>
            <th style="font-size: 11px;">QTY</th>
            <th style="font-size: 11px;">Rate</th>
            <th style="font-size: 11px;">Amount</th>
            </tr>
            ${customerList[0].Products?.map((x, i) => (
            `<tr>
                <td style="font-size: 11px;text-align:center">${i + 1}</td>
                <td style="font-size: 11px;text-align:left"><b>${x.Product?.Name}</b><br/>${x.Note?.replace(/(\r\n|\n|\r)/gm, "<br>")}</td>
                <td style="font-size: 11px;text-align:center">${x.Unit?.Name}</td>
                <td style="font-size: 11px;text-align:center">${x.Quantity}</td>
                <td style="font-size: 11px;text-align:center">${x.Price}</td>
                <td style="font-size: 11px;text-align:center">${x.TotalAmount}</td>
                </tr>`
        )).join('')}
        ${extraChargeRow}
        <tr style="background-color: #FFC000;">
            <td style="font-size: 11px;text-align:left" colspan="5"><strong>${customerList[0].Note.replace(/(\r\n|\n|\r)/gm, "<br>")}<strong></td>
            <td style="font-size: 11px;text-align:center"><strong>₹&nbsp;&nbsp;${customerList[0].FinalPrice}<strong></td>
            </tr>
        </tbody>
        </table>`)
        templateHtml = templateHtml.replace('{{token.gsttable}}', `<table border="1" cellpadding="10" cellspacing="0" style="width:100%;border-collapse: collapse;border-left:revert-layer">
        <tbody>
            <tr>
            <th style="font-size: 11px;">S No.</th>
            <th style="font-size: 11px;">Description</th>
            <th style="font-size: 11px;">QTY</th>
            <th style="font-size: 11px;">Unit Price</th>
            <th style="font-size: 11px;">Unit</th>
            <th style="font-size: 11px;">Amount</th>
            <th style="font-size: 11px;">CGST</th>
            <th style="font-size: 11px;">SGST</th>
            <th style="font-size: 11px;">Total (₹)</th>
            </tr>
            ${customerList[0].Products?.map((x, i) => (
            `<tr>
            <td style="font-size: 11px;text-align:center">${i + 1}</td>
            <td style="font-size: 11px;text-align:left"><b>${x.Product?.Name}</b><br/>${x.Note?.replace(/(\r\n|\n|\r)/gm, "<br>")}</td>
            <td style="font-size: 11px;text-align:center">${x.Quantity}</td>
            <td style="font-size: 11px;text-align:center">${x.Price}</td>
            <td style="font-size: 11px;text-align:center">${x.Unit?.Name}</td>
            <td style="font-size: 11px;text-align:center">${x.TotalAmount}</td>
            <td style="font-size: 11px;text-align:center">${(x.TotalAmount * x.CGST) / 100} (${x.CGST}%)</td>
            <td style="font-size: 11px;text-align:center">${(x.TotalAmount * x.SGST) / 100} (${x.SGST}%)</td>
            <td style="font-size: 11px;text-align:center">${x.FinalAmount}</td>
            </tr>`
        ))}
        </tbody>
        </table>`)
        templateHtml = templateHtml.replace('{{token.igsttable}}', `<table border="1" cellpadding="10" cellspacing="0" style="width:100%;border-collapse: collapse;border-left:revert-layer">
        <tbody>
            <tr>
            <th style="font-size: 11px;">S No.</th>
            <th style="font-size: 11px;">Description</th>
            <th style="font-size: 11px;">QTY</th>
            <th style="font-size: 11px;">Unit Price</th>
            <th style="font-size: 11px;">Unit</th>
            <th style="font-size: 11px;">Amount</th>
            <th style="font-size: 11px;">IGST</th>
            <th style="font-size: 11px;">Total (₹)</th>
            </tr>
            ${customerList[0].Products?.map((x, i) => (
            `<tr>
            <td style="font-size: 11px;text-align:center">${i + 1}</td>
            <td style="font-size: 11px;text-align:left"><b>${x.Product?.Name}</b><br/>${x.Note?.replace(/(\r\n|\n|\r)/gm, "<br>")}</td>
            <td style="font-size: 11px;text-align:center">${x.Quantity}</td>
            <td style="font-size: 11px;text-align:center">${x.Price}</td>
            <td style="font-size: 11px;text-align:center">${x.Unit?.Name}</td>
            <td style="font-size: 11px;text-align:center">${x.TotalAmount}</td>
            <td style="font-size: 11px;text-align:center">${(x.TotalAmount * x.CGST) / 100 + (x.TotalAmount * x.SGST) / 100} (${(x.CGST * 2)}%)</td>
            <td style="font-size: 11px;text-align:center">${x.FinalAmount}</td>
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

const deleteQuatation = asyncHandler(async (req, res) => {
    try {
        let Quatation = Quatations(req.conn);
        let QuatationProduct = QuatationProducts(req.conn);

        await QuatationProduct.deleteMany({ QuatationId: req.params.id }).lean()

        await Quatation.deleteOne({ _id: req.params.id }).lean().exec((err, doc) => {
            if (err) {
                return res.status(401).json({
                    success: false,
                    msg: err
                }).end();
            } else {
                return res.status(200).json({
                    success: true,
                    msg: "Quatation removed. ",
                }).end();
            }
        });

    } catch (err) {
        return res.status(400).json({
            success: false,
            msg: "Error in removing Quatation. " + err.message,
            data: null,
        });
    }

});

const duplicateLead = asyncHandler(async (req, res) => {
    let Quatation = Quatations(req.conn);
    let Customers = Customer(req.conn);
    let Country = Countrys(req.conn);
    let State = States(req.conn);
    let City = Citys(req.conn);
    let Icon = Icons(req.conn);
    let Lead = Leads(req.conn);
    const { quotationId } = req.body;

    const quotation = await Quatation.findById(quotationId)
    .populate({
        path: 'Customer',
        populate: [
            { path: 'Country' },
            { path: 'State' },
            { path: 'City' }
        ]
    });    
      
    if (!quotation || !quotation.Customer) {
        return res.status(404).json({ message: 'Quotation or Customer not found' });
    } 

    const icon = await Icon.findOne({ Name: 'Quotation' });
    const iconId = icon ? icon._id : null;

    const leadData = {
        Company: quotation.Customer.Company,
        GSTNo: quotation.Customer.GSTNo,
        Title: quotation.Customer.Title,
        FirstName: quotation.Customer.FirstName,
        LastName: quotation.Customer.LastName,
        Designation: quotation.Customer.Designation,
        Mobile: quotation.Customer.Mobile,
        Email: quotation.Customer.Email,
        Address: quotation.Customer.Address,
        Icon: iconId,
        Stage: "New",
        is_active: quotation.Customer.is_active,
        Notes: quotation.Customer.Notes,
        LeadSince: new Date(),
        StageDate: new Date(),
        City: quotation.Customer.City?._id || null, 
        State: quotation.Customer.State?._id || null, 
        Country: quotation.Customer.Country?._id || null, 
        addedBy: req.user._id
    };

    const newLead = await Lead.create(leadData);
    return res.status(200).json({
        success: true,
        msg: "Lead Added",
        data: newLead
    });
});

module.exports = {
    addQuatation,
    editQuatation,
    removeQuatation,
    getAllQuatation,
    getQuatationById,
    moveToOrder,
    Quatationpdfcreate,
    deleteQuatation,
    duplicateLead
}