const express = require('express')
const router = express.Router()

const {
    addLead,
    editLead,
    removeLead,
    getAllLead,
    getLeadById,
    addNext,
    editNext,
    getNext,
    moveToProspect,
    importExcel,
    setAsFavorite,
    addOtherContact,
    getOtherContact
} = require('../controllers/leadController')
const { protect } = require('../middleware/authMiddleware')

router.post('/add', protect, addLead)
router.post('/edit', protect, editLead)
router.post('/addNext', protect, addNext)
router.post('/editNext', protect, editNext)
router.post('/importExcel', protect, importExcel)
router.post('/getAll', protect, getAllLead)
router.post('/moveToProspect/:id', protect, moveToProspect)
router.post('/setAsFavorite', protect, setAsFavorite)
router.post('/remove', protect, removeLead)
router.post('/addOtherContact', protect, addOtherContact)
router.get('/otherContact/:id', protect, getOtherContact)
router.get('/:id', protect, getLeadById)
router.get('/getNext/:id', protect, getNext)

module.exports = router
