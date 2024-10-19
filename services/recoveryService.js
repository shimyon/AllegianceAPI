const RecoveryModel = require('../models/recoveryModel')
const Recoverys = RecoveryModel.RecoveryModal;
const Users = require('../models/userModel');
const CustomerModal = require('../models/customerModel')
const Customers = CustomerModal.CustomerModal
const moment = require('moment')

const getInCompleteRocovery = async () => {
    let Recovery = Recoverys(req.conn);
    let User = Users(req.conn);
    let Customer = Customers(req.conn);
    const recovery = await Recovery.find({
        Status: 'In Complete',
        NextFollowup:moment(new Date()).format("YYYY-MM-DD")
    }).populate("Customer").populate("addedBy").lean();

    return recovery;
}

module.exports = {
    getInCompleteRocovery
}