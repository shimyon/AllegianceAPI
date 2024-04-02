const express = require('express')
const router = express.Router()

const { 
    addInvoice,
    editInvoice,
    removeInvoice,
    getAllInvoice,
    getInvoiceById,
    Invoicepdfcreate
 } = require('../controllers/invoiceController')
const { protect } = require('../middleware/authMiddleware')

router.post('/add', protect, addInvoice)
router.post('/edit', protect, editInvoice)
router.post('/remove/:id', protect, removeInvoice)
router.post('/getAll', protect, getAllInvoice)
router.get('/getById/:id', protect, getInvoiceById)
router.post('/Invoicepdfcreate', Invoicepdfcreate)

module.exports = router
