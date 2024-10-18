const moment = require('moment');
const DashboardModal = require('../models/dashboardModel')
const Dashboards = DashboardModal.Dashboard
const LeadModal = require('../models/leadModel')
const Lead = LeadModal.LeadsModal;
const Master = require('../models/masterModel')
const Product = Master.ProductModal;
const CustomerModal = require('../models/customerModel')
const Customer = CustomerModal.CustomerModal
const ProspectModal = require('../models/prospectModel')
const Prospect = ProspectModal.ProspectsModal;
const ContractModel = require('../models/contractModel')
const Contract = ContractModel.ContractModal;
const SupportModel = require('../models/supportModel')
const Support = SupportModel.SupportModal;
const RecoveryModel = require('../models/recoveryModel')
const Recovery = RecoveryModel.RecoveryModal;
const OrderModel = require('../models/orderModel')
const Order = OrderModel.OrderModal;
const QuatationModel = require('../models/quatationModel')
const Quatation = QuatationModel.QuatationModal;
const InvoiceModel = require('../models/invoiceModel')
const Invoice = InvoiceModel.InvoiceModal;


const getcount = async (req) => {
    let Dashboard = Dashboards(req.conn);
    const newDashboardcount = await Dashboard.find().populate("UserId").lean();

    return newDashboardcount;
}

const setDashboardCount = async (req) => {
    let Dashboard = Dashboards(req.conn);
    let newDashboardcount = await getcount(req);
    var dashboardCount = {
        LeadCount: 0,
        ProspectCount: 0,
        QuatationCount: 0,
        OrderCount: 0,
        InvoiceCount: 0,
        RecoveryCount: 0,
        ProjectCount: 0,
        SupportCount: 0,
        ProductCount: 0,
        CustomerCount: 0,
    };
    for (const elements in newDashboardcount) {
        if (Object.hasOwnProperty.call(newDashboardcount, elements)) {
            const element = newDashboardcount[elements];
            dashboardCount.LeadCount = await Lead.find({ is_active: true, Stage: "New" }).count({});
            dashboardCount.ProspectCount = await Prospect.find({ is_active: true }).count({});
            dashboardCount.QuatationCount = await Quatation.find({ is_active: true }).count({});
            dashboardCount.OrderCount = await Order.find({ is_active: true }).count({});
            dashboardCount.InvoiceCount = await Invoice.find({ is_active: true }).count({});
            dashboardCount.RecoveryCount = await Recovery.find({ is_active: true }).count({});
            dashboardCount.ProjectCount = await Contract.find({ is_active: true }).count({});
            dashboardCount.SupportCount = await Support.find({ is_active: true }).count({});
            dashboardCount.ProductCount = await Product.find({ is_active: true }).count({});
            dashboardCount.CustomerCount = await Customer.find({ is_active: true }).count({});
            let user = await Dashboard.findByIdAndUpdate(element._id, {
                Lead: dashboardCount.LeadCount,
                Prospect: dashboardCount.ProspectCount,
                Quatation: dashboardCount.QuatationCount,
                Order: dashboardCount.OrderCount,
                Invoice: dashboardCount.InvoiceCount,
                Recovery: dashboardCount.RecoveryCount,
                Project: dashboardCount.ProjectCount,
                Support: dashboardCount.SupportCount,
                Product: dashboardCount.ProductCount,
                Customer: dashboardCount.CustomerCount,
            });
            user = await Dashboard.findOne({ _id: element._id });
            console.log(user)
        }
    }
}

module.exports = {
    getcount,
    setDashboardCount
}