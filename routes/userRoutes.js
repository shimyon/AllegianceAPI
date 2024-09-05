const express = require('express')
const router = express.Router()

const { addOrganizationUser,checkOrganization,registerUser, loginUser, getUserById ,updateUser,changePassword,getAllUser,forgotPassword,removeUser } = require('../controllers/userController')
const { protect } = require('../middleware/authMiddleware')
const db_middleware = require('../middleware/establish')
router.post('/add',db_middleware, registerUser)
router.post('/updateUser', db_middleware, protect, updateUser)
router.post('/changePassword', db_middleware, protect, changePassword)
router.post('/login',db_middleware, loginUser)
router.post('/forgotPassword',db_middleware, forgotPassword)
router.post('/getAllUser', db_middleware, protect, getAllUser)
router.get('/:id', db_middleware, protect, getUserById)
router.post('/removeUser', db_middleware, protect, removeUser)
router.post('/addOrganization',db_middleware, addOrganizationUser)
router.post('/checkOrganization',checkOrganization)

module.exports = router
