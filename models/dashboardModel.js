const mongoose = require('mongoose')

const DashboardSchema = mongoose.Schema(
    {
        UserId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        Lead: {
            type: Number
        },
        Prospect: {
            type: Number
        },
        Support: {
            type: Number
        },
        Recovery: {
            type: Number
        },
        Project: {
            type: Number
        },
        Order: {
            type: Number
        },
        Product: {
            type: Number
        },
        Customer: {
            type: Number
        },
    },
    {
        timestamps: true,
    }
)

const newsFeedSchema = mongoose.Schema(
    {
        title: {
            type: String
        },
        description: {
            type: String
        },
        image: {
            type: String
        },
        url: {
            type: String
        },
        DateTime: {
            type: Date,
        },
        is_active: {
            type: Boolean,
            default: true
        },
        addedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    },
    {
        timestamps: true,
    }
)

// const NewsFeed = mongoose.model('NewsFeed', newsFeedSchema);
// const Dashboard = mongoose.model('Dashboard', DashboardSchema);

// const syncIndex = async () => {
//     await NewsFeed.syncIndexes();
//     await Dashboard.syncIndexes();
// }
// syncIndex();

// module.exports = { NewsFeed, Dashboard };
module.exports = {
    NewsFeed: (conn) => conn.model('NewsFeed', newsFeedSchema),
    Dashboard: (conn) => conn.model('Dashboard', DashboardSchema)
}