const express = require('express')
const router = express.Router()

const {
    addQuatation,
    editQuatation,
    removeQuatation,
    getAllQuatation,
    getQuatationById,
    moveToOrder,
    Quatationpdfcreate,
    deleteQuatation
} = require('../controllers/quatationController')
const { protect } = require('../middleware/authMiddleware')

router.post('/add', protect, addQuatation)
router.post('/edit', protect, editQuatation)
router.post('/remove/:id', protect, removeQuatation)
router.post('/getAll', protect, getAllQuatation)
router.post('/moveToOrder/:id', protect, moveToOrder)
router.get('/getById/:id', protect, getQuatationById)
router.get('/deleteQuatation/:id', protect, deleteQuatation)
router.post('/Quatationpdfcreate', Quatationpdfcreate)


module.exports = router
