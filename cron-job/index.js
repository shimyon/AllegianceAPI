const LeadCronLoad = require('./leadCron');
const ProspectCronLoad = require('./prospectCron');
const DashboardCronLoad = require('./dashboardCron');
const ReCoveryCronLoad = require('./recoveryCron');
const NewsFeedCron = require('./newsfeedCron');
const loadCronJob = (req) => {
    try {
        // NewsFeedCron(req);
        LeadCronLoad(req);
        ProspectCronLoad(req);
        DashboardCronLoad(req);
        ReCoveryCronLoad(req);
    } catch (error) {
        console.log("Cron job error: " + error);
        console.error(error);
    }
}

module.exports = loadCronJob;