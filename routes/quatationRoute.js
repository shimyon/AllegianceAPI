const express = require('express')
const router = express.Router()

const {
    addQuatation,
    editQuatation,
    removeQuatation,
    getAllQuatation,
    getCustomerById,
    changeQuatationStatus,
    moveToOrder,
    Quatationpdfcreate
} = require('../controllers/quatationController')
const { protect } = require('../middleware/authMiddleware')

router.post('/add', protect, addQuatation)
router.post('/edit', protect, editQuatation)
router.post('/remove/:id', protect, removeQuatation)
router.post('/changeQuatationStatus', protect, changeQuatationStatus)
router.get('/getAll', protect, getAllQuatation)
router.post('/moveToOrder/:id', protect, moveToOrder)
router.get('/getById/:id', protect, getCustomerById)
router.post('/Quatationpdfcreate', Quatationpdfcreate)

module.exports = router
