const express = require('express')
const router = express.Router()

const { 
    addQuatation,
    editQuatation,
    removeQuatation,
    getAllQuatation,
    getCustomerById,
    changeQuatationStatus
 } = require('../controllers/quatationController')
const { protect } = require('../middleware/authMiddleware')

router.post('/add', protect, addQuatation)
router.post('/edit', protect, editQuatation)
router.post('/remove/:id', protect, removeQuatation)
router.post('/changeQuatationStatus', protect, changeQuatationStatus)
router.get('/getAll', protect, getAllQuatation)
router.get('/getById/:id', protect, getCustomerById)

module.exports = router
