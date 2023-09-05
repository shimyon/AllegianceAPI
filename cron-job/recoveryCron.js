var cron = require('node-cron');
const { sendMail } = require('../middleware/sendMail');
const { getInCompleteRocovery } = require('../services/recoveryService');

const ReCoveryCronLoad = () => {
    cron.schedule('30 9 * * *', async () => {
        console.log(`Recovery Cron`);
        let recoverys = await getInCompleteRocovery();
        recoverys.forEach(element => {
            sendMail(process.env.Email_To,`${element.Note}`, `${element.Customer.Title} ${element.Customer.FirstName} ${element.Customer.LastName} Recovery today for amount ${element.Amount}`);
            console.log(`Recovery element ${element._id}`);
        });
    });
}

module.exports = ReCoveryCronLoad;