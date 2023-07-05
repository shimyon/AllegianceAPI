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
    removeProcess,
    updateProcess,
    addDailyStatus,
    getAllDailyStatus,
    addSubProcess,
    editSubProcess,
    getSubAllProcess,
    getSubProcessById,
    removeSubProcess
 } = require('../controllers/contractController')
const { protect } = require('../middleware/authMiddleware')

router.post('/addContract', protect, addContract)
router.post('/editContract', protect, editContract)
router.post('/getAllContract', protect, getAllContract)
router.post('/getContractById/:id', protect, getContractById)
router.post('/removeContract', protect, removeContract)
router.post('/addProcess', protect, addProcess)
router.post('/editProcess', protect, editProcess)
router.post('/getAllProcess', protect, getAllProcess)
router.post('/getProcessById', protect, getProcessById)
router.get('/removeProcess/:id', protect, removeProcess)
router.post('/updateProcess', protect, updateProcess)
router.post('/addDailyStatus', protect, addDailyStatus)
router.get('/getAllDailyStatus/:id', protect, getAllDailyStatus)
router.post('/addSubProcess', protect, addSubProcess)
router.post('/editSubProcess', protect, editSubProcess)
router.post('/getSubAllProcess', protect, getSubAllProcess)
router.post('/getSubProcessById', protect, getSubProcessById)
router.get('/removeSubProcess/:id', protect, removeSubProcess)

module.exports = router
