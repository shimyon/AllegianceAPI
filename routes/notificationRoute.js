const express = require('express')
const router = express.Router();
const { protect } = require('../middleware/authMiddleware')
const { getAllNotificationByUId, setmarkasread } = require('../controllers/notificationController')

router.post('/getAllNotificationByUId', protect, getAllNotificationByUId)
router.post('/markasread', protect, setmarkasread)


module.exports = router