const express = require('express')
const router = express.Router()

const { add, getById, update, getAll,remove,setDefault,deleteTemplate } = require('../controllers/templateController')
const { protect } = require('../middleware/authMiddleware')
const db_middleware = require('../middleware/establish')
router.post('/add', db_middleware, protect,  add)
router.post('/update', db_middleware, protect, update)
router.post('/getAll', db_middleware, protect, getAll)
router.post('/remove/:id', db_middleware, protect, remove)
router.get('/getById/:id', db_middleware, protect, getById)
router.post('/setDefault', db_middleware, protect, setDefault)
router.get('/deleteTemplate/:id', db_middleware, protect, deleteTemplate)

module.exports = router
