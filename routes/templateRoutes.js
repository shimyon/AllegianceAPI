const express = require('express')
const router = express.Router()

const { add, getById, update, getAll,remove,setDefault,deleteTemplate } = require('../controllers/templateController')
const { protect } = require('../middleware/authMiddleware')
router.post('/add',protect,  add)
router.post('/update',protect, update)
router.post('/getAll',protect, getAll)
router.post('/remove/:id',protect, remove)
router.get('/getById/:id',protect, getById)
router.post('/setDefault',protect, setDefault)
router.get('/deleteTemplate/:id',protect, deleteTemplate)

module.exports = router
