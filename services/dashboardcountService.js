const DashboardModal = require('../models/dashboardModel')
const Dashboard = DashboardModal.Dashboard

const getcount = async () => {
    const newDashboardcount = await Dashboard.find().populate("UserId").lean();

    return newDashboardcount;
}

module.exports = {
    getcount
}