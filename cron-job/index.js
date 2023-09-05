const LeadCronLoad = require('./leadCron');
const ProspectCronLoad = require('./prospectCron');
const SupportCronLoad = require('./supportCron');
const ProjectCronLoad = require('./projectCron');
const ReCoveryCronLoad = require('./recoveryCron');
const TaskCronLoad = require('./taskCron');


const loadCronJob = () => {
    try {
        
        LeadCronLoad();
        ProspectCronLoad();
        // SupportCronLoad();
        // ProjectCronLoad();
        // TaskCronLoad();
        ReCoveryCronLoad();

    } catch (error) {
        console.log("Cron job error: " + error);
        console.error(error);
    }
}

module.exports = loadCronJob;