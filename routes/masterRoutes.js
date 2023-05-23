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
    addUnit,
    editUnit,
    changeUnitStatus,
    getUnits,
    getUnitById,
    getExecutive,
    changeSourceStatus } = require('../controllers/masterController')
const { protect } = require('../middleware/authMiddleware')

router.get('/getExecutive', protect, getExecutive)

router.post('/addProduct', protect, addProduct)
router.post('/editProduct', protect, editProduct)
router.post('/changeProductStatus', protect, changeProductStatus)
router.post('/getProduct', protect, getProduct)
router.get('/product/:id', protect, getProductById)

router.post('/addSource', protect, addSource)
router.post('/editSource', protect, editSource)
router.post('/changeSourceStatus', protect, changeSourceStatus)
router.get('/getSource', protect, getSources)
router.get('/source/:id', protect, getSourceById)


router.post('/addUnit', protect, addUnit)
router.post('/editUnit', protect, editUnit)
router.post('/changeUnitStatus', protect, changeUnitStatus)
router.get('/getUnit', protect, getUnits)
router.get('/unit/:id', protect, getUnitById)

module.exports = router
