var cron = require('node-cron');
const { sendMail } = require('../middleware/sendMail');

const LeadCronLoad = () => {
    cron.schedule('*/10 * * * * *', () => {
        // sendMail(process.env.Email_To,'Sample Mail', 'Sample Mail');
        console.log('Lead cron running a task every 10 second' + new Date().toString());
    });
}

module.exports = LeadCronLoad;