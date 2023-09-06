const RecoveryModel = require('../models/recoveryModel')
const Recovery = RecoveryModel.RecoveryModal;
const moment = require('moment')

const getInCompleteRocovery = async () => {
    const recovery = await Recovery.find({
        Status: 'In Complete',
        OnHold: false,
        NextFollowup:moment(new Date()).format("YYYY-MM-DD")
    }).populate("Customer").populate("addedBy").lean();

    return recovery;
}

module.exports = {
    getInCompleteRocovery
}