const express = require('express')
const router = express.Router()

const { 
    addRecovery,
    getAllRecovery,
    getRecoveryById,
    removeRecovery,
    editRecovery
 } = require('../controllers/recoveryController')
const { protect } = require('../middleware/authMiddleware')

router.post('/addRecovery', protect, addRecovery)
router.post('/editRecovery', protect, editRecovery)
router.post('/getAllRecovery', protect, getAllRecovery)
router.get('/getRecoveryById/:id', protect, getRecoveryById)
router.post('/removeRecovery', protect, removeRecovery)

module.exports = router
