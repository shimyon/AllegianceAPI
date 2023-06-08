const express = require('express')
const router = express.Router()

const { 
    addContract,
    getAllContract,
    getContractById,
    removeContract,
    editContract
 } = require('../controllers/contractController')
const { protect } = require('../middleware/authMiddleware')

router.post('/addContract', protect, addContract)
router.post('/editContract', protect, editContract)
router.post('/getAllContract', protect, getAllContract)
router.get('/getContractById/:id', protect, getContractById)
router.post('/removeContract', protect, removeContract)

module.exports = router
