var cron = require('node-cron');
const { updateNewsFeed } = require('../services/newsfeedService');

const NewsFeedCron = (req) => {
    cron.schedule('0 */2 * * *', async (req) => {
        await updateNewsFeed(req);
    });
}

module.exports = NewsFeedCron;