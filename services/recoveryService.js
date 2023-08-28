const RecoveryModel = require('../models/recoveryModel')
const Recovery = RecoveryModel.RecoveryModal;

const getInCompleteRocovery = async () => {
    const recovery = await Recovery.find({
        Status: 'In Complete',
        OnHold: false
    }).lean();

    return recovery;
}

module.exports = {
    getInCompleteRocovery
}