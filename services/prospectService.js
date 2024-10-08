const ProspectModal = require('../models/prospectModel')
const Prospects = ProspectModal.LeadsModal;
const NextOns = ProspectModal.ProNextOnModal;
const moment = require('moment')

const getprospectAction = async () => {
    let NextOn = NextOns(req.conn);
    let Prospect = Prospects(req.conn);
    const next = await NextOn.find({
        date:moment(new Date()).format("YYYY-MM-DD")
    }).populate("prospectId").lean();

    return next;
}

module.exports = {
    getprospectAction
}