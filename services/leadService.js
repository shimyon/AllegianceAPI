const LeadModal = require('../models/leadModel')
const Leads = LeadModal.LeadsModal;
const NextOns = LeadModal.NextOnModal;
const moment = require('moment')

const getleadAction = async () => {
    let NextOn = NextOns(req.conn);
    let Lead = Leads(req.conn);
    const next = await NextOn.find({
        date:moment(new Date()).format("YYYY-MM-DD")
    }).populate("leadId").lean();

    return next;
}

module.exports = {
    getleadAction
}