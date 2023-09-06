var cron = require('node-cron');
const { sendMail } = require('../middleware/sendMail');
const { getInCompleteRocovery } = require('../services/recoveryService');

const ReCoveryCronLoad = () => {
    cron.schedule('0 10 * * *', async () => {
        console.log(`Recovery Cron`);
        let recoverys = await getInCompleteRocovery();
        recoverys.forEach(element => {
            sendMail(element.addedBy.email,`Followup for Recovery- [CRM Bot]`, `${element.Customer.Title} ${element.Customer.FirstName} ${element.Customer.LastName} Recovery today for amount ${element.Amount}. Note:${element.Note}`);
            console.log(`Recovery element ${element._id}`);
        });
    });
}

module.exports = ReCoveryCronLoad;