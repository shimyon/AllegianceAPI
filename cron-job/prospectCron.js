var cron = require('node-cron');
const { sendMail } = require('../middleware/sendMail');
const { getprospectAction } = require('../services/prospectService');
const User = require('../models/userModel')

const ProspectCron = () => {
    cron.schedule('0 10 * * *', async () => {
        let nexts = await getprospectAction();
        nexts.forEach(async (element) =>  {
            const sales =  await User.findById(element.prospectId.Sales);
            sendMail(sales.email,`Followup for Prospect- [CRM Bot]`, `${element.prospectId.Title} ${element.prospectId.FirstName} ${element.prospectId.LastName} Prospect Followup. Note:${element.note}`);
            console.log(`Prospect element ${element._id}`);
        });
    });
}

module.exports = ProspectCron;