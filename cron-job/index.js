const LeadCronLoad = require('./leadCron');
const ProspectCronLoad = require('./prospectCron');
const DashboardCronLoad = require('./dashboardCron');
const ReCoveryCronLoad = require('./recoveryCron');


const loadCronJob = () => {
    try {
        
        LeadCronLoad();
        ProspectCronLoad();
        DashboardCronLoad();
        ReCoveryCronLoad();

    } catch (error) {
        console.log("Cron job error: " + error);
        console.error(error);
    }
}

module.exports = loadCronJob;