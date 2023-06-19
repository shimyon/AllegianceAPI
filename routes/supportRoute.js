const express = require('express')
const router = express.Router()

const { 
    addSupport,
    getAllSupport,
    getSupportById,
    updateSupport,
    editSupport
 } = require('../controllers/supportController')
const { protect } = require('../middleware/authMiddleware')

router.post('/addSupport', protect, addSupport)
router.post('/editSupport', protect, editSupport)
router.post('/getAllSupport', protect, getAllSupport)
router.get('/getSupportById/:id', protect, getSupportById)
router.post('/updateSupport', protect, updateSupport)

module.exports = router
