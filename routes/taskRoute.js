const express = require('express')
const router = express.Router()

const { 
    addtask,
    edittask,
    removetask,
    getAlltask,
    gettaskById,
    gettaskboardCount,
    addtaskcomment,
    getAlltaskcomment
 } = require('../controllers/taskController')
const { protect } = require('../middleware/authMiddleware')

router.post('/add', protect, addtask)
router.post('/edit', protect, edittask)
router.post('/remove/:id', protect, removetask)
router.post('/getAll', protect, getAlltask)
router.get('/getById/:id', protect, gettaskById)
router.get('/gettaskboardCount',protect, gettaskboardCount)
router.post('/addtaskcomment', protect, addtaskcomment)
router.post('/getAlltaskcomment',protect, getAlltaskcomment)
module.exports = router
