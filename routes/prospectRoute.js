const express = require('express')
const router = express.Router()

const {
    addProspect,
    editProspect,
    removeProspect,
    changeProspectStage,
    getAllProspect,
    getProspectById,
    addNext,
    editNext,
    getNext,
    getbyNext,
    addOtherContact,
    getOtherContact,
    importExcel,
    convertToCustomer,
    convertToQuotation,
    convertToProject,
    markAsRead,
    lastStatus
} = require('../controllers/prospectController')
const { protect } = require('../middleware/authMiddleware')

router.post('/add', protect, addProspect)
router.post('/edit', protect, editProspect)
router.post('/getAll', protect, getAllProspect)
router.post('/changeProspectStage', protect, changeProspectStage)
router.post('/remove', protect, removeProspect)
router.get('/:id', protect, getProspectById)
router.get('/convertToCustomer/:id', protect, convertToCustomer)
router.get('/convertToQuotation/:id', protect, convertToQuotation)
router.get('/convertToProject/:id', protect, convertToProject)
router.post('/addNext', protect, addNext)
router.post('/editNext', protect, editNext)
router.post('/addOtherContact', protect, addOtherContact)
router.get('/otherContact/:id', protect, getOtherContact)
router.post('/importExcel', protect, importExcel)
router.post('/markAsRead/:id', protect, markAsRead)
router.get('/getNext/:id', protect, getNext)
router.get('/getbyNext/:id', protect, getbyNext)
router.get('/lastStatus/:id', protect, lastStatus)


module.exports = router
