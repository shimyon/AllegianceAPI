const express = require('express')
const router = express.Router()

const { 
    addRecovery,
    getAllRecovery,
    getRecoveryById,
    removeRecovery,
    editRecovery,
    complateRecovery,
    deleteRecovery
 } = require('../controllers/recoveryController')
const { protect } = require('../middleware/authMiddleware')

router.post('/addRecovery', protect, addRecovery)
router.post('/editRecovery', protect, editRecovery)
router.post('/complateRecovery/:id', protect, complateRecovery)
router.post('/getAllRecovery', protect, getAllRecovery)
router.get('/getRecoveryById/:id', protect, getRecoveryById)
router.get('/deleteRecovery/:id', protect, deleteRecovery)
router.post('/removeRecovery', protect, removeRecovery)

module.exports = router
