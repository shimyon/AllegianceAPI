const express = require('express')
const router = express.Router()

const { 
    addContract,
    getAllContract,
    getContractById,
    removeContract
 } = require('../controllers/contractController')
const { protect } = require('../middleware/authMiddleware')

router.post('/addContract', protect, addContract)
router.post('/getAllContract', protect, getAllContract)
router.get('/getContractById/:id', protect, getContractById)
router.post('/removeContract', protect, removeContract)

module.exports = router
