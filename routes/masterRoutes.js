const express = require('express')
const router = express.Router()

const { 
    addProduct,
    editProduct,
    changeProductStatus,
    addSource,
    editSource,
    getProduct,
    getProductById,
    getSources,
    getSourceById,
    changeSourceStatus } = require('../controllers/masterController')
const { protect } = require('../middleware/authMiddleware')

router.post('/addProduct', protect, addProduct)
router.post('/editProduct', protect, editProduct)
router.post('/changeProductStatus', protect, changeProductStatus)
router.get('/getProduct', protect, getProduct)
router.get('/product/:id', protect, getProductById)

router.post('/addSource', protect, addSource)
router.post('/editSource', protect, editSource)
router.post('/changeSourceStatus', protect, changeSourceStatus)
router.get('/getSource', protect, getSources)
router.get('/source/:id', protect, getSourceById)

module.exports = router
