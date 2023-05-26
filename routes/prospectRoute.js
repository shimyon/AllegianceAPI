const express = require('express')
const router = express.Router()

const { 
    addProspect,
    editProspect,
    removeProspect,
    changeProspectStage,
    getAllProspect,
    getProspectById,
    addInteraction,
    addNext,
 } = require('../controllers/prospectController')
const { protect } = require('../middleware/authMiddleware')

router.post('/add', protect, addProspect)
router.post('/edit', protect, editProspect)
router.post('/getAll', protect, getAllProspect)
router.post('/changeProspectStage', protect, changeProspectStage)
router.post('/remove', protect, removeProspect)
router.get('/:id', protect, getProspectById)
router.post('/addNext', protect, addNext)
router.post('/addInteraction', protect, addInteraction)

module.exports = router
