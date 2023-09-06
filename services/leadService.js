const LeadModal = require('../models/leadModel')
const Lead = LeadModal.LeadsModal;
const NextOn = LeadModal.NextOnModal;
const moment = require('moment')

const getleadAction = async () => {
    const next = await NextOn.find({
        date:moment(new Date()).format("YYYY-MM-DD")
    }).populate("leadId").lean();

    return next;
}

module.exports = {
    getleadAction
}