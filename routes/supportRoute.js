const express = require('express')
const router = express.Router()

const { 
    addSupport,
    getAllSupport,
    getSupportById,
    updateSupport,
    editSupport,
    updateStatus
 } = require('../controllers/supportController')
const { protect } = require('../middleware/authMiddleware')

router.post('/addSupport', protect, addSupport)
router.post('/editSupport', protect, editSupport)
router.post('/getAllSupport', protect, getAllSupport)
router.get('/getSupportById/:id', protect, getSupportById)
router.post('/updateStatus', protect, updateStatus)

module.exports = router
