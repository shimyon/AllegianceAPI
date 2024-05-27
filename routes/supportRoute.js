const express = require('express')
const router = express.Router()

const { 
    addSupport,
    getAllSupport,
    getSupportById,
    updateSupport,
    editSupport,
    updateStatus,
    removeSupport,
    deleteSupport,
    addNext,
    editNext,
    getNext
 } = require('../controllers/supportController')
const { protect } = require('../middleware/authMiddleware')

router.post('/addSupport', protect, addSupport)
router.post('/editSupport', protect, editSupport)
router.post('/getAllSupport', protect, getAllSupport)
router.get('/getSupportById/:id', protect, getSupportById)
router.post('/updateStatus', protect, updateStatus)
router.post('/removeSupport', protect, removeSupport)
router.get('/deleteSupport/:id',protect, deleteSupport)
router.post('/addNext', protect, addNext)
router.post('/editNext', protect, editNext)
router.get('/getNext/:id', protect, getNext)

module.exports = router
