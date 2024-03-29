const asyncHandler = require('express-async-handler')
const InvoiceModal = require('../models/invoiceModel')
const User = require('../models/userModel')
const notificationModel = require('../models/notificationModel')
const Invoice = InvoiceModal.InvoiceModal
const InvoiceProduct = InvoiceModal.InvoiceProductModal
const OrderModal = require('../models/orderModel')
const OrderObject = OrderModal.OrderModal
const Master = require('../models/masterModel')
const ApplicationSetting = Master.ApplicationSettingModal;
var pdf = require('html-pdf')
var fs = require('fs')
var converter = require('number-to-words')
var format = require('date-format')
var test = require('tape')
var path = require('path')
const Template = require('../models/templateModel')
const { generatePDF } = require('../services/pdfService')

const addInvoice = asyncHandler(async (req, res) => {
    try {
        const existInvoiceCode = await Invoice.findOne({ $or: [{ InvoiceCode: req.body.InvoiceCode }] });
        if (existInvoiceCode) {
            return res.status(200).json({
                success: false,
                msg: "Invoice already exist with same Invoice code.",
                data: null,
            });
        }
        let invoiceNo = await Invoice.find({}, { InvoiceNo: 1, _id: 0 }).sort({ InvoiceNo: -1 }).limit(1);
        let maxInvoice = 1;
        if (invoiceNo.length > 0) {
            maxInvoice = invoiceNo[0].InvoiceNo + 1;
        }
        let applicationSetting = await ApplicationSetting.findOne();
        let code = "";
        if (applicationSetting.Invoice == true) {
            code = req.body.InvoiceCode;
        }
        else {
            code = applicationSetting.InvoicePrefix + maxInvoice + applicationSetting.InvoiceSuffix;
        }
        const newInvoice = await Invoice.create({
            InvoiceNo: maxInvoice,
            InvoiceCode: code,
            Customer: req.body.customer,
            ShippingAddress: req.body.shippingAddress || null,
            BillingAddress: req.body.billingAddress || null,
            Order: req.body.orderId,
            Amount: req.body.amount,
            BeforeTaxPrice: req.body.BeforeTaxPrice,
            CGST: req.body.CGST,
            SGST: req.body.SGST,
            TermsAndCondition: req.body.TermsAndCondition,
            Discount: req.body.discount,
            TotalTax: req.body.totalTax,
            AfterTaxPrice: req.body.AfterTaxPrice,
            FinalPrice: req.body.finalPrice,
            TermsAndCondition: req.body.TermsAndCondition,
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

        const prInvoice = await InvoiceProduct.create(products);
        for (var i = 0; i < prInvoice.length; i++) {
            newInvoice.Products.push(prInvoice[i]);
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
            return res.status(200).json({
                success: true,
                msg: "Invoice Added",
            }).end();
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
            TermsAndCondition: req.body.TermsAndCondition,
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
            InvoiceCode: req.body.InvoiceCode,
            ShippingAddress: req.body.shippingAddress,
            BillingAddress: req.body.billingAddress,
            Order: req.body.orderId,
            Amount: req.body.amount,
            BeforeTaxPrice: req.body.BeforeTaxPrice,
            CGST: req.body.CGST,
            SGST: req.body.SGST,
            TermsAndCondition: req.body.TermsAndCondition,
            Discount: req.body.discount,
            TotalTax: req.body.totalTax,
            AfterTaxPrice: req.body.AfterTaxPrice,
            FinalPrice: req.body.finalPrice,
            DeliveryDate: req.body.deliveryDate,
            Sales: req.body.sales,
            TermsAndCondition: req.body.TermsAndCondition,
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
                TotalAmount: pr.TotalAmount,
                FinalAmount: pr.FinalAmount,
                Note: pr.note
            }
            products.push(newPr);
        }

        const prInvoice = await InvoiceProduct.create(products);

        for (var i = 0; i < prInvoice.length; i++) {
            oldInvoice.Products.push(prInvoice[i]);
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
const Invoicepdfcreate = asyncHandler(async (req, res) => {
    try {
        const data = await Template.findById(req.body.template_id)
        var template = path.join(__dirname, '..', 'public', 'template.html')
        var templateHtml = fs.readFileSync(template, 'utf8')
        templateHtml = templateHtml.replace('{{Data}}', data.Detail)
        var filename = template.replace('template.html', `Print.pdf`)
        let applicationSetting = await ApplicationSetting.findOne();
        let customerList = await Invoice.find({ is_deleted: false, _id: req.body.id })
            .populate("Customer")
            .populate({
                path: 'Products',
                populate: {
                    path: 'Product',
                }
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
        templateHtml = templateHtml.replace('{{token.OfficeAddress}}', applicationSetting.OfficeAddress.replace(/(\r\n|\n|\r)/gm, "<br>") || '')
        templateHtml = templateHtml.replace('{{token.InvoiceNo}}', customerList[0].InvoiceCode || '')
        templateHtml = templateHtml.replace('{{token.CustomerNo}}', customerList[0].Customer?.CustomerCode || '')
        templateHtml = templateHtml.replace('{{token.date}}', format('dd-MM-yyyy', customerList[0].InvoiceDate))
        templateHtml = templateHtml.replace('{{token.validdate}}', format('dd-MM-yyyy', customerList[0].ValidDate))
        templateHtml = templateHtml.replace('{{token.email}}', customerList[0].Customer?.Email || '')
        templateHtml = templateHtml.replace('{{token.cmgst}}', customerList[0].Customer?.GSTNo || '')
        templateHtml = templateHtml.replace('{{token.mobile}}', customerList[0].Customer?.Mobile || '')
        templateHtml = templateHtml.replace('{{token.cmaddress}}', cmaddress)
        templateHtml = templateHtml.replace('{{token.cmcompany}}', customerList[0].Customer?.Company)
        templateHtml = templateHtml.replace('{{token.cmname}}', cmname)
        templateHtml = templateHtml.replace('{{token.cmfirstname}}', customerList[0].Customer?.FirstName)
        templateHtml = templateHtml.replace('{{token.termsandcondition}}', customerList[0].TermsAndCondition.replace(/(\r\n|\n|\r)/gm, "<br>") || '')
        templateHtml = templateHtml.replace('{{token.BeforeTaxPrice}}', customerList[0].BeforeTaxPrice || '0')
        templateHtml = templateHtml.replace('{{token.AfterTaxPrice}}', customerList[0].AfterTaxPrice || '0')
        templateHtml = templateHtml.replace('{{token.cgst}}', customerList[0].CGST || '0')
        templateHtml = templateHtml.replace('{{token.sgst}}', customerList[0].SGST || '0')
        templateHtml = templateHtml.replace('{{token.discount}}', (customerList[0].AfterTaxPrice * customerList[0].Discount) / 100)
        templateHtml = templateHtml.replace('{{token.finalamount}}', customerList[0].FinalPrice || '0')
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
            ${customerList[0].Products.map((x, i) => (
            `<tr>
                <td style="font-size: 11px;text-align:center">${i + 1}</td>
                <td style="font-size: 11px;text-align:left"><b>${x.Product?.Name}</b><br/>${x.Product?.Description}</td>
                <td style="font-size: 11px;text-align:center">${x.Quantity}</td>
                <td style="font-size: 11px;text-align:center">${x.Price}</td>
                <td style="font-size: 11px;text-align:center">${x.Unit}</td>
                <td style="font-size: 11px;text-align:center">${x.TotalAmount}</td>
                </tr>`
        ))}
        <tr style="background-color: #ffd700;">
            <td style="font-size: 11px;text-align:left" colspan="5"><strong>${customerList[0].Note.replace(/(\r\n|\n|\r)/gm, "<br>")}<strong></td>
            <td style="font-size: 11px;text-align:center"><strong>₹&nbsp;&nbsp;${(customerList[0].BeforeTaxPrice + customerList[0].OtherCharge)}<strong></td>
            </tr>
        </tbody>
        </table>`)
        templateHtml = templateHtml.replace('{{token.gsttable}}', `<table border="1" cellpadding="10" cellspacing="0" style="width:100%;border-collapse: collapse;border-left:revert-layer">
        <tbody>
            <tr>
            <th>S No.</th>
            <th>Description</th>
            <th>QTY</th>
            <th>Unit Price</th>
            <th>Unit</th>
            <th>Amount</th>
            <th>CGST</th>
            <th>SGST</th>
            <th>Total (₹)</th>
            </tr>
            ${customerList[0].Products.map((x, i) => (
            `<tr>
            <td style="text-align:center">${i + 1}</td>
            <td style="text-align:left"><b>${x.Product?.Name}</b><br/>${x.Product?.Description}</td>
            <td style="text-align:center">${x.Quantity}</td>
            <td style="text-align:center">${x.Price}</td>
            <td style="text-align:center">${x.Unit}</td>
            <td style="text-align:center">${x.TotalAmount}</td>
            <td style="text-align:center">${(x.TotalAmount * x.CGST) / 100} (${x.CGST}%)</td>
            <td style="text-align:center">${(x.TotalAmount * x.SGST) / 100} (${x.SGST}%)</td>
            <td style="text-align:center">${x.FinalAmount}</td>
            </tr>`
        ))}
        </tbody>
        </table>`)
        templateHtml = templateHtml.replace('{{token.igsttable}}', `<table border="1" cellpadding="10" cellspacing="0" style="width:100%;border-collapse: collapse;border-left:revert-layer">
        <tbody>
            <tr>
            <th>S No.</th>
            <th>Description</th>
            <th>QTY</th>
            <th>Unit Price</th>
            <th>Unit</th>
            <th>Amount</th>
            <th>IGST</th>
            <th>Total (₹)</th>
            </tr>
            ${customerList[0].Products.map((x, i) => (
            `<tr>
            <td style="text-align:center">${i + 1}</td>
            <td style="text-align:left"><b>${x.Product?.Name}</b><br/>${x.Product?.Description}</td>
            <td style="text-align:center">${x.Quantity}</td>
            <td style="text-align:center">${x.Price}</td>
            <td style="text-align:center">${x.Unit}</td>
            <td style="text-align:center">${x.TotalAmount}</td>
            <td style="text-align:center">${(x.TotalAmount * x.CGST) / 100 + (x.TotalAmount * x.SGST) / 100} (${(x.CGST * 2)}%)</td>
            <td style="text-align:center">${x.FinalAmount}</td>
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
    createOrderInvoice,
    Invoicepdfcreate
}