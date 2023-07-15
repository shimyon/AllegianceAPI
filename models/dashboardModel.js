const mongoose = require('mongoose')

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
        is_active:{
            type:Boolean,
            default:true
        },
        replay: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'NewsFeedReplay',
        }],
        addedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }
    },
    {
        timestamps: true,
    }
)

const newsFeedReplySchema = mongoose.Schema(
    {
        newsId:{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'NewsFeed'
        },
        replay: {
            type: String
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

const NewsFeed = mongoose.model('NewsFeed', newsFeedSchema);
const NewsFeedReplay = mongoose.model('NewsFeedReplay', newsFeedReplySchema);

const syncIndex = async () => {
    await NewsFeed.syncIndexes();
    await NewsFeedReplay.syncIndexes();
}
syncIndex();

module.exports = { NewsFeed, NewsFeedReplay};