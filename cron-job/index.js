const LeadCronLoad = require('./leadCron');
const ReCoveryCronLoad = require('./recoveryCron');
const TaskCronLoad = require('./taskCron');


const loadCronJob = () => {
    try {
        
        LeadCronLoad();

        TaskCronLoad();

        ReCoveryCronLoad();

    } catch (error) {
        console.log("Cron job error: " + error);
        console.error(error);
    }
}

module.exports = loadCronJob;