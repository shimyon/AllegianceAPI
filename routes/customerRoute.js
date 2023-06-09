const express = require('express')
const router = express.Router()

const { 
    addCustomer,
    editCustomer,
    removeCustomer,
    addBillingAddress,
    editBillingAddress,
    removeBillingAddress,
    addShippingAddress,
    editShippingAddress,
    removeShippingAddress,
    getAllCustomer,
    getCustomerById,
    setDefaultAddress
 } = require('../controllers/customerController')
const { protect } = require('../middleware/authMiddleware')

router.post('/addCustomer', protect, addCustomer)
router.post('/editCustomer', protect, editCustomer)
router.post('/removeCustomer/:id', protect, removeCustomer)
router.post('/getAllCustomer', protect, getAllCustomer)
router.get('/getCustomerById/:id', protect, getCustomerById)

router.post('/addBillingAddress', protect, addBillingAddress)
router.post('/editBillingAddress', protect, editBillingAddress)
router.post('/removeBillingAddress/:id', protect, removeBillingAddress)

router.post('/addShippingAddress', protect, addShippingAddress)
router.post('/editShippingAddress', protect, editShippingAddress)
router.post('/removeShippingAddress/:id', protect, removeShippingAddress)

router.post('/setDefaultAddress', protect, setDefaultAddress)

module.exports = router
