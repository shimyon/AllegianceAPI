const express = require('express')
const router = express.Router()

const { add, getById, update, getAll,remove,setDefault } = require('../controllers/templateController')
const { protect } = require('../middleware/authMiddleware')
router.post('/add',  add)
router.post('/update', update)
router.post('/getAll', getAll)
router.post('/remove/:id', remove)
router.get('/getById/:id', getById)
router.post('/setDefault', setDefault)

module.exports = router
