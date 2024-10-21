const ProspectModal = require('../models/prospectModel')
const Prospect = ProspectModal.LeadsModal;
const nextoncontactModel = require('../models/nextoncontactModel')
const NextOn = nextoncontactModel.NextOnModal;
const moment = require('moment')

const getprospectAction = async () => {
    const next = await NextOn.find({
        date:moment(new Date()).format("YYYY-MM-DD")
    }).populate("prospectId").lean();

    return next;
}

module.exports = {
    getprospectAction
}