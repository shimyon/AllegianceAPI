var cron = require('node-cron');
const { sendMail } = require('../middleware/sendMail');
const { getleadAction } = require('../services/leadService');

const LeadCronLoad = () => {
    cron.schedule('*/10 * * * * *', async () => {
        let nexts = await getleadAction();
        nexts.forEach(element => {
            debugger
        // sendMail(process.env.Email_To,'Sample Mail', 'Sample Mail');
            console.log(`Recovery element ${element._id}`);
        });
        // sendMail(process.env.Email_To,'Sample Mail', 'Sample Mail');
        console.log('Lead cron running a task every 10 second' + new Date().toString());
    });
}

module.exports = LeadCronLoad;