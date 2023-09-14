var cron = require('node-cron');
const { getcount } = require('../services/dashboardcountService');
const moment = require('moment');
const DashboardModal = require('../models/dashboardModel')
const Dashboard = DashboardModal.Dashboard
const LeadModal = require('../models/leadModel')
const Lead = LeadModal.LeadsModal;
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
const DashboardCron = () => {
    cron.schedule('*/10 * * * * *', async() => {
        let newDashboardcount = await getcount();
        var dashboardCount = {
            leadCount: 0,
            prospectCount: 0,
            processCount: 0,
            supportCount: 0,
            orderCount: 0,
            recoveryCount: 0
        };
        newDashboardcount.forEach(async (element) =>  {
            if (element.UserId.role == "Admin") {
                dashboardCount.leadCount = await Lead.find({ is_active: true, Stage: "New" }).count({});
                dashboardCount.prospectCount = await Prospect.find({ is_active: true }).count({});
                dashboardCount.processCount = await Contract.find({ is_active: true }).count({});
                dashboardCount.supportCount = await Support.find({ is_active: true }).count({});
                dashboardCount.recoveryCount = await Recovery.find({ is_active: true }).count({});
                dashboardCount.orderCount = await Order.find({ is_active: true }).count({});
            }
            else {
                dashboardCount.leadCount = await Lead.find({ is_active: true, addedBy: element.UserId._id, Stage: "New" }).count({});
                dashboardCount.prospectCount = await Prospect.find({ is_active: true, addedBy: element.UserId._id }).count({});
                dashboardCount.processCount = await Contract.find({ is_active: true, "Process.sales": element.UserId._id}).count({});
                dashboardCount.supportCount = await Support.find({ is_active: true, $or: [{ addedBy: element.UserId._id }, { Sales: element.UserId._id }] }).count({});
                dashboardCount.recoveryCount = await Recovery.find({ is_active: true, addedBy: element.UserId._id }).count({});
                dashboardCount.orderCount = await Order.find({ is_active: true, $or: [{ addedBy: element.UserId._id }, { Sales: element.UserId._id }] }).count({});
            }
            let user = Dashboard.findByIdAndUpdate(element._id, {
                Lead: dashboardCount.leadCount,
                Prospect: dashboardCount.prospectCount,
                Support: dashboardCount.supportCount,
                Recovery: dashboardCount.recoveryCount,
                Project: dashboardCount.processCount,
                Order: dashboardCount.orderCount,
                LastUpdate: moment(new Date()).format("YYYY-MM-DD HH:mm"),
            });
            user = await Dashboard.findOne({ _id: element._id });
            console.log(user)
        });
    });
}

module.exports = DashboardCron;