const express = require('express')
const router = express.Router()

const {
    addOrder,
    editOrder,
    removeOrder,
    getAllOrder,
    getOrderById,
    changeOrderStatus,
    Orderpdfcreate,
    moveToInvoice
} = require('../controllers/orderController')
const { protect } = require('../middleware/authMiddleware')

router.post('/add', protect, addOrder)
router.post('/edit', protect, editOrder)
router.post('/remove/:id', protect, removeOrder)
router.post('/changeOrderStatus', protect, changeOrderStatus)
router.post('/getAll', protect, getAllOrder)
router.get('/getById/:id', protect, getOrderById)
router.post('/moveToInvoice/:id', protect, moveToInvoice)
router.post('/Orderpdfcreate', Orderpdfcreate)

module.exports = router
