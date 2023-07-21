const express = require('express')
const router = express.Router()

const { 
    addNewsFeed,
    editNewsFeed,
    getAllNews,
    getNewsById,
    removeNewsFeed,
    saveNewsReplay,
    getDashboardCount
 } = require('../controllers/dashboardController')
const { protect } = require('../middleware/authMiddleware')

router.post('/addNewsFeed', protect, addNewsFeed)
router.post('/editNewsFeed', protect, editNewsFeed)
router.post('/removeNewsFeed', protect, removeNewsFeed)
router.post('/getAllNews', protect, getAllNews)
router.get('/getNewsById/:id', protect, getNewsById)
router.post('/saveNewsReplay', protect, saveNewsReplay)
router.get('/getDashboardCount', protect, getDashboardCount)
module.exports = router