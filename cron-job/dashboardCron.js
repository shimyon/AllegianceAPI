var cron = require('node-cron');
const { getcount, setDashboardCount } = require('../services/dashboardcountService');
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
    cron.schedule('0 */2 * * *', async() => {
        await setDashboardCount();
    });
}

module.exports = DashboardCron;