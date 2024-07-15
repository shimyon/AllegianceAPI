var cron = require('node-cron');
const { updateNewsFeed } = require('../services/newsfeedService');

const NewsFeedCron = () => {
    cron.schedule('0 */2 * * *', async () => {
        await updateNewsFeed();
    });
}

module.exports = NewsFeedCron;