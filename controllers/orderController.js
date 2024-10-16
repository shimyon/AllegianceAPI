const asyncHandler = require('express-async-handler')
const OrderModal = require('../models/orderModel')
const User = require('../models/userModel')
const Notification = require('../models/notificationModel')
const Orders = OrderModal.OrderModal
const OrderProducts = OrderModal.OrderProductModal
const InvoiceModal = require('../models/invoiceModel')
const Invoices = InvoiceModal.InvoiceModal
const InvoiceProducts = InvoiceModal.InvoiceProductModal
// const Master = require('../models/masterModel')
// const Status = Master.StatusModal;
// const ApplicationSetting = Master.ApplicationSettingModal;
const SassMaster = require('../models/saasmasterModel');
const ApplicationSettings = SassMaster.ApplicationSettingModal;
const Statuss = SassMaster.StatusModal;
const Products = SassMaster.ProductModal;
const Units = SassMaster.UnitModal;
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

const addOrder = asyncHandler(async (req, res) => {
    try {
        let Order = Orders(req.conn);
        let OrderProduct = OrderProducts(req.conn);
        let ApplicationSetting = ApplicationSettings(req.conn);
        let notificationModel = Notification(req.conn);
        let Status = Statuss(req.conn);

        const existOrderCode = await Order.findOne({ $or: [{ OrderCode: req.body.OrderCode }] });
        if (existOrderCode) {
            return res.status(200).json({
                success: false,
                msg: "Order already exist with same Order code.",
                data: null,
            });
        }
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
            code = req.body.OrderCode;
        }
        else {
            code = applicationSetting.OrderPrefix + maxOrder + `/${financialYearStart}-${financialYearEnd}` + applicationSetting.OrderSuffix;
        }
        let status = await Status.find({GroupName:"Orders"}).lean();
        const newOrder = await Order.create({
            OrderNo: maxOrder,
            OrderCode: code,
            Customer: req.body.customer,
            OrderName: req.body.OrderName,
            Descriptionofwork: req.body.Descriptionofwork,
            ShippingAddress: req.body.shippingAddress || null,
            BillingAddress: req.body.billingAddress || null,
            Status: status[0],
            Stage: "New",
            Sales: req.body.sales || null,
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
            DeliveryDate: req.body.deliveryDate,
            Note: req.body.note,
            is_deleted: false
        });

        var products = [];

        for (var i = 0; i < req.body.products.length; i++) {
            var pr = req.body.products[i];
            var newPr = {
                OrderId: newOrder._id.toString(),
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

        const prOrder = await OrderProduct.create(products);
        for (var i = 0; i < prOrder.length; i++) {
            newOrder.Products.push(prOrder[i]);
        }
        newOrder.save((err) => {
            if (err) throw err;
        });
        if (newOrder) {
            let date = new Date();
            const savedNotification = await notificationModel.create({
                description: `Order(${newOrder.OrderCode}) entry has been created`,
                date: date,
                link: "Orders",
                userId: newOrder.Sales,
                Isread: false
            });
            // let resuser = await User.find({ is_active: true, role: 'SuperAdmin' });
            // let insertdata = resuser.map(f => ({
            //     description: `Order(${newOrder.OrderCode}) entry has been created`,
            //     date: date,
            //     link: "Orders",
            //     userId: f._id,
            //     Isread: false
            // }));
            // if (insertdata.length > 0) {
            //     const savedNotification = await notificationModel.insertMany(insertdata);
            // }
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
        let Order = Orders(req.conn);
        let OrderProduct = OrderProducts(req.conn);

        const oldOrder = await Order.findById(req.body.id);
        if (!oldOrder) {
            return res.status(400).json({
                success: false,
                msg: "Order not found"
            });
        }

        await Order.findByIdAndUpdate(req.body.id, {
            OrderCode: req.body.OrderCode,
            Customer: req.body.customer,
            OrderName: req.body.OrderName,
            Descriptionofwork: req.body.Descriptionofwork,
            ShippingAddress: req.body.shippingAddress || null,
            BillingAddress: req.body.billingAddress || null,
            Sales: req.body.sales || null,
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
            DeliveryDate: req.body.deliveryDate,
            Note: req.body.note,
        });

        await OrderProduct.deleteMany({ OrderId: req.body.id }).lean()
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
                TotalAmount: pr.TotalAmount,
                FinalAmount: pr.FinalAmount,
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
        let Order = Orders(req.conn);
        let OrderProduct = OrderProducts(req.conn);

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
        let Order = Orders(req.conn);

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
                '$lookup': {
                    'from': 'status',
                    'localField': 'Status',
                    'foreignField': '_id',
                    'as': 'Status'
                }
            },
            {
                $unwind: {
                    path: '$Status',
                    preserveNullAndEmptyArrays: true
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
        const lastOrderCode = await Order.find().sort({createdAt: -1});
        const orderList = await Order.aggregate(query).exec();
        if (orderList.length == 0) {
            return res.status(200).json({
                success: true,
                data: { Count: 0, data: [] }
            }).end();
        }
        else {
            return res.status(200).json({
                success: true,
                data: orderList[0],
                lastOrderCode: lastOrderCode[0],
            }).end();
        }
    } catch (err) {
        return res.status(400).json({
            success: false,
            msg: "Error in getting Order. " + err.message,
            data: null,
        });
    }
})

const Orderpdfcreate = asyncHandler(async (req, res) => {
    try {
        let Order = Orders(req.conn);
        let OrderProduct = OrderProducts(req.conn);
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
        let customerList = await Order.find({ is_deleted: false, _id: req.body.id })
            .populate("Customer")
            .populate({
                path: 'Products',
                populate: [
                    { path: 'Product' },
                    { path: 'Unit' }
                ]
            })
            .populate("addedBy", 'name email')
        let cmname = customerList[0].Customer?.Title || "" + customerList[0].Customer?.FirstName + ' ' + customerList[0].Customer?.LastName;
        let cmaddress = customerList[0].Customer?.Address || "" + '<br/>' + customerList[0].Customer?.City + ' ' + customerList[0].Customer?.State;
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
        templateHtml = templateHtml.replace('{{token.OrderNo}}', customerList[0].OrderCode || '')
        templateHtml = templateHtml.replace('{{token.CustomerNo}}', customerList[0].Customer?.CustomerCode || '')
        templateHtml = templateHtml.replace('{{token.date}}', format('dd-MM-yyyy', customerList[0].OrderDate))
        templateHtml = templateHtml.replace('{{token.validdate}}', format('dd-MM-yyyy', customerList[0].ValidDate))
        templateHtml = templateHtml.replace('{{token.email}}', customerList[0].Customer?.Email || '')
        templateHtml = templateHtml.replace('{{token.cmgst}}', customerList[0].Customer?.GSTNo || '')
        templateHtml = templateHtml.replace('{{token.mobile}}', customerList[0].Customer?.Mobile || '')
        templateHtml = templateHtml.replace('{{token.cmaddress}}', cmaddress)
        templateHtml = templateHtml.replace('{{token.cmcompany}}', customerList[0].Customer?.Company)
        templateHtml = templateHtml.replace('{{token.cmname}}', cmname)
        templateHtml = templateHtml.replace('{{token.cmfirstname}}', customerList[0].Customer?.FirstName)
        templateHtml = templateHtml.replace('{{token.BeforeTaxPrice}}', customerList[0].BeforeTaxPrice || '0')
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
        <tr style="background-color: #ffd700;">
            <th style="font-size: 11px;">S No.</th>
            <th style="font-size: 11px;">Description</th>
            <th style="font-size: 11px;">QTY</th>
            <th style="font-size: 11px;">Unit Price</th>
            <th style="font-size: 11px;">Unit</th>
            <th style="font-size: 11px;">Amount</th>
            </tr>
            ${customerList[0].Products?.map((x, i) => (
            `<tr>
                <td style="font-size: 11px;text-align:center">${i + 1}</td>
                <td style="font-size: 11px;text-align:left"><b>${x.Product?.Name}</b><br/>${x.Note?.replace(/(\r\n|\n|\r)/gm, "<br>")}</td>
                <td style="font-size: 11px;text-align:center">${x.Quantity}</td>
                <td style="font-size: 11px;text-align:center">${x.Price}</td>
                <td style="font-size: 11px;text-align:center">${x.Unit?.Name}</td>
                <td style="font-size: 11px;text-align:center">${x.TotalAmount}</td>
                </tr>`
        ))}
        <tr style="background-color: #ffd700;">
            <td style="font-size: 11px;text-align:left" colspan="5"><strong>${customerList[0].Note?.replace(/(\r\n|\n|\r)/gm, "<br>")}<strong></td>
            <td style="font-size: 11px;text-align:center"><strong>₹&nbsp;&nbsp;${(customerList[0].BeforeTaxPrice + customerList[0].OtherCharge)}<strong></td>
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

const getOrderById = asyncHandler(async (req, res) => {
    try {
        let Order = Orders(req.conn);
        let OrderProduct = OrderProducts(req.conn);
        let Customers = Customer(req.conn);
        let BillingAddresss = BillingAddress(req.conn);
        let ShippingAddresss = ShippingAddress(req.conn);
        let Users = User(req.conn);
       
        let customerList = await Order.find({ is_deleted: false, _id: req.params.id })
            .populate("Customer")
            .populate("Products")
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
        let Order = Orders(req.conn);

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
        let Order = Orders(req.conn);
        let OrderProduct = OrderProducts(req.conn);
        let Customers = Customer(req.conn);
        let BillingAddresss = BillingAddress(req.conn);
        let ShippingAddresss = ShippingAddress(req.conn);
        let Users = User(req.conn);
        let Invoice = Invoices(req.conn);
        let InvoiceProduct = InvoiceProducts(req.conn);
        let ApplicationSetting = ApplicationSettings(req.conn);

        let invoiceExisting = await Order.findById(req.params.id)
            .populate("Customer")
            .populate("Products")
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
        if (applicationSetting.Invoice == true) {
            code = invoiceExisting.OrderCode;
        }
        else {
            code = applicationSetting.InvoicePrefix + maxInvoice + `/${financialYearStart}-${financialYearEnd}` + applicationSetting.InvoiceSuffix;
        }
        const newInvoice = await Invoice.create({
            InvoiceNo: maxInvoice,
            InvoiceCode: code,
            Customer: invoiceExisting.Customer,
            OrderId: invoiceExisting._id,
            QuatationId: invoiceExisting.QuatationId,
            InvoiceName: invoiceExisting.OrderName,
            Descriptionofwork: invoiceExisting.Descriptionofwork,
            ShippingAddress: invoiceExisting.ShippingAddress,
            BillingAddress: invoiceExisting.BillingAddress,
            Sales: invoiceExisting.Sales,
            addedBy: req.user._id,
            BeforeTaxPrice: invoiceExisting.BeforeTaxPrice,
            CGST: invoiceExisting.CGST,
            SGST: invoiceExisting.SGST,
            TermsAndCondition: invoiceExisting.TermsAndCondition,
            OtherChargeName: invoiceExisting.OtherChargeName,
            OtherCharge: invoiceExisting.OtherCharge,
            Discount: invoiceExisting.Discount,
            TotalTax: invoiceExisting.TotalTax,
            AfterTaxPrice: invoiceExisting.AfterTaxPrice,
            FinalPrice: invoiceExisting.FinalPrice,
            RoundOff: invoiceExisting.RoundOff,
            Amount: invoiceExisting.Amount,
            InvoiceDate: invoiceExisting.DeliveryDate,
            Note: invoiceExisting.Note,
            is_deleted: false
        });
        var products = [];
        for (var i = 0; i < invoiceExisting.Products.length; i++) {
            var pr = invoiceExisting.Products[i];
            var newPr = {
                InvoiceId: newInvoice._id.toString(),
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

const deleteOrder = asyncHandler(async (req, res) => {
    try {
        let Order = Orders(req.conn);
        let OrderProduct = OrderProducts(req.conn);

        await OrderProduct.deleteMany({ OrderId: req.params.id }).lean()

        await Order.deleteOne({ _id: req.params.id }).lean().exec((err, doc) => {
            if (err) {
                return res.status(401).json({
                    success: false,
                    msg: err
                }).end();
            } else {
                return res.status(200).json({
                    success: true,
                    msg: "Order removed. ",
                }).end();
            }
        });

    } catch (err) {
        return res.status(400).json({
            success: false,
            msg: "Error in removing Order. " + err.message,
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
    Orderpdfcreate,
    changeOrderStatus,
    moveToInvoice,
    deleteOrder
}