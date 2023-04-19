const express = require('express')
const router = express.Router()

const { 
    addLead,
    editLead,
    removeLead,
    getAllLead,
    getLeadById,
    addInteraction,
    addNext,
    assignExecutive,
    moveToProspect,
    importExcel
 } = require('../controllers/leadController')
const { protect } = require('../middleware/authMiddleware')

router.post('/add', protect, addLead)
router.post('/edit', protect, editLead)
router.post('/addInteraction', protect, addInteraction)
router.post('/addNext', protect, addNext)
router.post('/importExcel', protect, importExcel)
router.post('/assignExecutive', protect, assignExecutive)
router.get('/getAll', protect, getAllLead)
router.post('/moveToProspect/:id', protect, moveToProspect)
router.post('/remove/:id', protect, removeLead)
router.get('/:id', protect, getLeadById)

module.exports = router
