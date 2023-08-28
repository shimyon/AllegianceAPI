var cron = require('node-cron');
const { sendMail } = require('../middleware/sendMail');
const { getInCompleteRocovery } = require('../services/recoveryService');

const ReCoveryCronLoad = () => {
    cron.schedule('57 0 * * *', async () => {
        // sendMail(process.env.Email_To,'Sample Mail', 'Sample Mail');
        console.log(`Recovery Cron`);
        let recoverys = await getInCompleteRocovery();
        recoverys.forEach(element => {
            console.log(`Recovery element ${element._id}`);
        });
    });
}

module.exports = ReCoveryCronLoad;