const express = require('express')
const router = express.Router()

const { 
    addAttendance,
    getAllAttendance,
    getAttendanceById,
    editAttendance,
    deleteAttendanceById,
    AppAttendance,
    gettodayAttendance
 } = require('../controllers/attendanceController')
const { protect } = require('../middleware/authMiddleware')

router.post('/addAttendance', protect, addAttendance)
router.post('/editAttendance', protect, editAttendance)
router.post('/getAllAttendance', protect, getAllAttendance)
router.get('/getAttendanceById/:id', protect, getAttendanceById)
router.post('/deleteAttendanceById/:id', protect, deleteAttendanceById)
router.post('/addappAttendance', AppAttendance)
router.post('/gettodayAttendance', gettodayAttendance)


module.exports = router
