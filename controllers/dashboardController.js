const asyncHandler = require('express-async-handler')
const DashboardModal = require('../models/dashboardModel')
const Dashboard = DashboardModal.Dashboard
const NewsFeed = DashboardModal.NewsFeed
const LeadModal = require('../models/leadModel')
const Lead = LeadModal.LeadsModal;
const ProspectModal = require('../models/prospectModel')
const Prospect = ProspectModal.ProspectsModal;
const ContractModel = require('../models/contractModel')
const Contract = ContractModel.ContractModal;
const SupportModel = require('../models/supportModel')
const Support = SupportModel.SupportModal;
const uploadFile = require("../middleware/uploadFileMiddleware");


const addNewsFeed = asyncHandler(async (req, res) => {
    try {
        process.env.UPLOADFILE = "";
        await uploadFile(req, res, function (err) {
            if (err) {
                return ("Error uploading file.");
            } else {
                saveNewsFeed(req, res, process.env.UPLOADFILE)
            }
        })

    } catch (err) {
        return res.status(400).json({
            success: false,
            msg: "Error in adding data. " + err.message,
            data: null,
        });

    }
})
const saveNewsFeed = asyncHandler(async (req, res, fileName) => {
    try {

        await NewsFeed.create({
            title: req.body.title,
            description: req.body.description,
            url: req.body.url,
            DateTime: req.body.DateTime,
            image: fileName.replace(",", ""),
            is_active: true,
            addedBy: req.user._id,

        });
        return res.status(200).json({
            success: true,
            msg: "News Feed added successfully"
        });
    } catch (err) {
        return res.status(400).json({
            success: false,
            msg: "Error in adding News Feed. " + err.message
        });
    }
})
const editNewsFeed = asyncHandler(async (req, res) => {
    try {
        process.env.UPLOADFILE = "";
        await uploadFile(req, res, function (err) {
            if (err) {
                return ("Error uploading file.");
            } else {
                editSave(req, res, process.env.UPLOADFILE)
            }
        })

    } catch (err) {
        return res.status(400).json({
            success: false,
            msg: "Error in editing data. " + err.message,
            data: null,
        });

    }
})
const editSave = asyncHandler(async (req, res, fileName) => {
    try {
        let existNews = await NewsFeed.findById(req.body.id);
        if (!existNews) {
            return res.status(400).json({
                success: false,
                msg: "News feed not found"
            });
        }

        fileName = fileName != "" ? fileName.replace(",", "") : existNews.image;

        await NewsFeed.findByIdAndUpdate(req.body.id, {
            title: req.body.title,
            description: req.body.description,
            url: req.body.url,
            DateTime: req.body.DateTime,
            image: fileName,
        });
        return res.status(200).json({
            success: true,
            msg: "News Feed updated successfully"
        });
    } catch (err) {
        return res.status(400).json({
            success: false,
            msg: "Error in updating News Feed. " + err.message
        });
    }
})
const getAllNews = asyncHandler(async (req, res) => {
    try {
        let newsList = await NewsFeed.find({ is_active: req.body.active }).sort({ createdAt: -1 })
            .populate("addedBy", 'name email')
        return res.status(200).json({
            success: true,
            data: newsList
        }).end();
    } catch (err) {
        return res.status(400).json({
            success: false,
            msg: "Error in getting news. " + err.message,
            data: null,
        });
    }
})
const getNewsById = asyncHandler(async (req, res) => {
    try {
        let newsList = await NewsFeed.find({ _id: req.params.id }).populate("addedBy", 'name email')
        return res.status(200).json({
            success: true,
            data: newsList
        }).end();
    } catch (err) {
        return res.status(400).json({
            success: false,
            msg: "Error in getting news. " + err.message,
            data: null,
        });
    }
})
const removeNewsFeed = asyncHandler(async (req, res) => {
    try {
        const existNews = await NewsFeed.findById(req.params.id);
        if (!existNews) {
            return res.status(200).json({
                success: false,
                msg: "News not found.",
                data: null,
            });
        }

        const news = await NewsFeed.findByIdAndUpdate(req.params.id, {
            is_active: req.body.active
        });

        return res.status(200).json({
            success: true,
            msg: "News active " + req.body.active,
            data: null
        }).end();
    } catch (err) {
        return res.status(400).json({
            success: false,
            msg: "Error in process. " + err.message,
            data: null,
        });
    }

});

const getDashboardCount = asyncHandler(async (req, res) => {
    try {
        user = await Dashboard.findOne({ UserId: req.user._id }).populate("UserId");
        const now = new Date();
        const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);
        const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        
        const leadresults = await Lead.aggregate([
            {
                $match: {
                    createdAt: { $gte: sixMonthsAgo }
                }
            },
            {
                $match: {
                    is_active: true
                }
            },
            {
                $group: {
                    _id: { year: { $year: "$LeadSince" }, month: { $month: "$LeadSince" } },
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { "_id.year": 1, "_id.month": 1 }
            }
        ]);
        const prospectresults = await Prospect.aggregate([
            {
                $match: {
                    createdAt: { $gte: sixMonthsAgo }
                }
            },
            {
                $match: {
                    is_active: true
                }
            },
            {
                $group: {
                    _id: { year: { $year: "$createdAt" }, month: { $month: "$createdAt" } },
                    count: { $sum: 1 }
                }
            },
            {
                $sort: { "_id.year": 1, "_id.month": 1 }
            }
        ]);

        const leadcount = leadresults.map(result => ({
            month: `${months[result._id.month - 1]} ${result._id.year}`,
            count: result.count
        }));
        const prospectcount = prospectresults.map(result => ({
            month: `${months[result._id.month - 1]} ${result._id.year}`,
            count: result.count
        }));

        return res.status(200).json({
            success: true,
            data: {user,leadcount,prospectcount}
        }).end();
    } catch (err) {
        return res.status(400).json({
            success: false,
            msg: "Error in getting count. " + err.message,
            data: null,
        });
    }
})
module.exports = {
    addNewsFeed,
    editNewsFeed,
    getAllNews,
    getNewsById,
    removeNewsFeed,
    getDashboardCount
}