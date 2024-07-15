const DashboardModal = require('../models/dashboardModel');
const NewsFeed = DashboardModal.NewsFeed;
const moment = require('moment');
const scrapeIt = require('scrape-it');
const path = require('path');
const crypto = require("crypto");
const request = require('request');
const fs = require('fs');
const downloadImage = async (uri, filename) => {
    return new Promise((success, reject) => {
        try {
            request.head(uri, function (err, res, body) {
                console.log('content-type:', res.headers['content-type']);
                console.log('content-length:', res.headers['content-length']);

                request(uri).pipe(fs.createWriteStream(filename)).on('close', success);
            });
        } catch (error) {
            reject(error);
        }
    });
}

const updateNewsFeed = async () => {
    try {
        // Promise interface
        scrapeIt("https://www.allegianceindia.in/latest-updates/1", {
            artical: "article:eq(0) .update-list",
            data: {
                selector: "article:eq(0) .entry-cover a img",
                attr: "data-src"
            },
            title: {
                selector: 'article:eq(0) .update-list',
                convert: x => x.substring(0, 50)
            },
            articaldate: {
                selector: 'article:eq(0) .post-date',
                convert: x => new Date(x)
            }
        }).then(async ({ data, status }) => {
            console.log(`Status Code: ${status}`)
            console.log(data);
            //Generate filename
            let filename = crypto.randomBytes(16).toString("hex");
            filename = `${filename}.png`;

            //Set filepath
            let filepath = path.join(process.env.UPLOAD_FOLDER, "uploads", filename);
            await downloadImage(data.data, filepath);

            let newsfeed = await NewsFeed.find({ DateTime: data.articaldate }).limit(1);
            if (newsfeed.length == 0) {
                await NewsFeed.create({
                    image: filename,
                    title: data.title,
                    description: data.artical,
                    DateTime: data.articaldate
                });
            }
        });
    } catch (error) {
        console.log(error);
    }
}

module.exports = {
    updateNewsFeed
}