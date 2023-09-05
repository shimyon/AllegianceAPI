var cron = require('node-cron');
const { sendMail } = require('../middleware/sendMail');

const ProspectCron = () => {
    cron.schedule('*/10 * * * * *', () => {
        // sendMail(process.env.Email_To,'Sample Mail', 'Sample Mail');
        console.log('Prospect cron running a task every 10 second' + new Date().toString());
    });
}

module.exports = ProspectCron;