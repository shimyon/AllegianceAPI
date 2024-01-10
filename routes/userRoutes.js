const express = require('express')
const router = express.Router()

const { registerUser, loginUser, getUserById ,updateUser,changePassword,getAllUser } = require('../controllers/userController')
const { protect } = require('../middleware/authMiddleware')
router.post('/add', registerUser)
router.post('/updateUser', protect, updateUser)
router.post('/changePassword', protect, changePassword)
router.post('/login', loginUser)
router.post('/getAllUser', protect, getAllUser)
router.get('/:id', protect, getUserById)

module.exports = router
