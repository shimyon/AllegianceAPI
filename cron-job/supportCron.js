var cron = require('node-cron');
const { sendMail } = require('../middleware/sendMail');

const SupportCronLoad = () => {
    cron.schedule('7 12 * * *', () => {
        // sendMail(process.env.Email_To,'Sample Mail', 'Sample Mail');
        console.log('Support cron running a task every 10 second' + new Date().toString());
    });
}

module.exports = SupportCronLoad;