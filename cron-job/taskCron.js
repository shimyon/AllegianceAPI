var cron = require('node-cron');

const TaskCronLoad = () => {
    cron.schedule('* * * * *', () => {
        console.log('Task cron running a task every 10 second');
    });
}

module.exports = TaskCronLoad;