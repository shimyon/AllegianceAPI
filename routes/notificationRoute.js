const express = require('express')
const router = express.Router();
const { protect } = require('../middleware/authMiddleware')
const { getAllNotificationByUId, setmarkasread ,setmarkasallread} = require('../controllers/notificationController')

router.post('/getAllNotificationByUId', getAllNotificationByUId)
router.post('/markasread', protect, setmarkasread)
router.post('/markasallread', protect, setmarkasallread)

module.exports = router