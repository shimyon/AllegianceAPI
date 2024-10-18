const express = require('express')
const router = express.Router();
const { protect } = require('../middleware/authMiddleware')
const { getAllNotificationByUId,getNotification, setmarkasread ,setmarkasallread} = require('../controllers/notificationController')

router.post('/getAllNotificationByUId',protect, getAllNotificationByUId)
router.post('/getNotification',protect, getNotification)
router.post('/markasread', protect, setmarkasread)
router.post('/markasallread', protect, setmarkasallread)

module.exports = router