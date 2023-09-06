var cron = require('node-cron');
const { sendMail } = require('../middleware/sendMail');
const { getleadAction } = require('../services/leadService');
const User = require('../models/userModel')

const LeadCronLoad = () => {
    cron.schedule('0 10 * * *', async () => {
        let nexts = await getleadAction();
        nexts.forEach(async (element) =>  {
            const sales = await User.findById(element.leadId.Sales);
            sendMail(sales.email,`Followup for Lead- [CRM Bot]`, `${element.leadId.Title} ${element.leadId.FirstName} ${element.leadId.LastName} Lead Followup. Note:${element.note}`);
            console.log(`Lead element ${element._id}`);
        });
    });
}

module.exports = LeadCronLoad;