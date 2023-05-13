const express = require('express')
const router = express.Router()

const { 
    addInvoice,
    editInvoice,
    removeInvoice,
    getAllInvoice,
    getInvoiceById,
    createOrderInvoice
 } = require('../controllers/invoiceController')
const { protect } = require('../middleware/authMiddleware')

router.post('/add', protect, addInvoice)
router.post('/edit', protect, editInvoice)
router.post('/remove/:id', protect, removeInvoice)
router.get('/getAll', protect, getAllInvoice)
router.get('/getById/:id', protect, getInvoiceById)
router.get('/createOrderInvoice/:id', protect, createOrderInvoice)

module.exports = router
