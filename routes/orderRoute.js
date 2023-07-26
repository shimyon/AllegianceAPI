const express = require('express')
const router = express.Router()

const { 
    addOrder,
    editOrder,
    removeOrder,
    getAllOrder,
    getOrderById,
    changeOrderStatus,
    pdfcreate
 } = require('../controllers/orderController')
const { protect } = require('../middleware/authMiddleware')

router.post('/add', protect, addOrder)
router.post('/edit', protect, editOrder)
router.post('/remove/:id', protect, removeOrder)
router.post('/changeOrderStatus', protect, changeOrderStatus)
router.get('/getAll', protect, getAllOrder)
router.get('/getById/:id', protect, getOrderById)
router.post('/pdfcreate/:id', pdfcreate)

module.exports = router
