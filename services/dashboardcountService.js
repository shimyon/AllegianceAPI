const moment = require('moment');
const DashboardModal = require('../models/dashboardModel')
const Dashboard = DashboardModal.Dashboard
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



const getcount = async () => {
    const newDashboardcount = await Dashboard.find().populate("UserId").lean();

    return newDashboardcount;
}

const setDashboardCount = async () => {
    let newDashboardcount = await getcount();
    var dashboardCount = {
        leadCount: 0,
        prospectCount: 0,
        processCount: 0,
        supportCount: 0,
        orderCount: 0,
        recoveryCount: 0,
        productCount: 0,
        customerCount: 0,
    };
    for (const elements in newDashboardcount) {
        if (Object.hasOwnProperty.call(newDashboardcount, elements)) {
            const element = newDashboardcount[elements];
            if (element.UserId.role == "SuperAdmin") {
                dashboardCount.leadCount = await Lead.find({ is_active: true, Stage: "New" }).count({});
                dashboardCount.prospectCount = await Prospect.find({ is_active: true }).count({});
                dashboardCount.processCount = await Contract.find({ is_active: true }).count({});
                dashboardCount.supportCount = await Support.find({ is_active: true }).count({});
                dashboardCount.recoveryCount = await Recovery.find({ is_active: true }).count({});
                dashboardCount.orderCount = await Order.find({ is_active: true }).count({});
                dashboardCount.productCount = await Product.find({ is_active: true}).count({});
                dashboardCount.customerCount = await Customer.find({ is_active: true }).count({});
            }
            else {
                dashboardCount.leadCount = await Lead.find({ is_active: true, addedBy: element.UserId._id, Stage: "New" }).count({});
                dashboardCount.prospectCount = await Prospect.find({ is_active: true, addedBy: element.UserId._id }).count({});
                dashboardCount.processCount = await Contract.find({ is_active: true, "Process.sales": element.UserId._id }).count({});
                dashboardCount.supportCount = await Support.find({ is_active: true, $or: [{ addedBy: element.UserId._id }, { Sales: element.UserId._id }] }).count({});
                dashboardCount.recoveryCount = await Recovery.find({ is_active: true, addedBy: element.UserId._id }).count({});
                dashboardCount.orderCount = await Order.find({ is_active: true, $or: [{ addedBy: element.UserId._id }, { Sales: element.UserId._id }] }).count({});
                dashboardCount.productCount = 0;
                dashboardCount.customerCount = 0;
            }
            let user = await Dashboard.findByIdAndUpdate(element._id, {
                Lead: dashboardCount.leadCount,
                Prospect: dashboardCount.prospectCount,
                Support: dashboardCount.supportCount,
                Recovery: dashboardCount.recoveryCount,
                Project: dashboardCount.processCount,
                Order: dashboardCount.orderCount,
                Product: dashboardCount.productCount,
                Customer: dashboardCount.customerCount,
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