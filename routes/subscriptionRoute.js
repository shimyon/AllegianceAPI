const express = require('express')
const router = express.Router()

const { 
    addSubscription,
    getAllSubscription,
    getSubscriptionById,
    removeSubscription,
    editSubscription,
    deleteSubscription
 } = require('../controllers/subscriptionController')
const { protect } = require('../middleware/authMiddleware')

router.post('/addSubscription', protect, addSubscription)
router.post('/editSubscription', protect, editSubscription)
router.post('/getAllSubscription', protect, getAllSubscription)
router.post('/getSubscriptionById/:id', protect, getSubscriptionById)
router.post('/removeSubscription', protect, removeSubscription)
router.get('/deleteSubscription/:id', protect, deleteSubscription)

module.exports = router
