const express = require('express')
const router = express.Router()

const { 
    addContract,
    getAllContract,
    getContractById,
    removeContract,
    editContract,
    addProcess,
    editProcess,
    getAllProcess,
    getProcessById,
    removeProcess
 } = require('../controllers/contractController')
const { protect } = require('../middleware/authMiddleware')

router.post('/addContract', protect, addContract)
router.post('/editContract', protect, editContract)
router.post('/getAllContract', protect, getAllContract)
router.get('/getContractById/:id', protect, getContractById)
router.post('/removeContract', protect, removeContract)
router.post('/addProcess', protect, addProcess)
router.post('/editProcess', protect, editProcess)
router.post('/getAllProcess', protect, getAllProcess)
router.get('/getProcessById', protect, getProcessById)
router.get('/removeProcess/:id', protect, removeProcess)

module.exports = router
