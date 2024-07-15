const express = require('express')
const router = express.Router()

const { 
    addNewsFeed,
    editNewsFeed,
    getAllNews,
    getNewsById,
    removeNewsFeed,
    deleteNewsFeed,
    getDashboardCount
 } = require('../controllers/dashboardController')
const { protect } = require('../middleware/authMiddleware')

router.post('/addNewsFeed', protect, addNewsFeed)
router.post('/editNewsFeed', protect, editNewsFeed)
router.post('/removeNewsFeed/:id', protect, removeNewsFeed)
router.post('/deleteNewsFeed/:id', protect, deleteNewsFeed)
router.post('/getAllNews', protect, getAllNews)
router.get('/getNewsById/:id', protect, getNewsById)
router.get('/getDashboardCount', protect, getDashboardCount)
module.exports = router
