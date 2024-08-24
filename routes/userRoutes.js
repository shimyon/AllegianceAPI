const express = require('express')
const router = express.Router()

const { addOrganizationUser,checkOrganization,registerUser, loginUser, getUserById ,updateUser,changePassword,getAllUser,forgotPassword,removeUser } = require('../controllers/userController')
const { protect } = require('../middleware/authMiddleware')
const db_middleware = require('../middleware/establish')
router.post('/add',db_middleware, registerUser)
router.post('/updateUser', protect,db_middleware, updateUser)
router.post('/changePassword', protect,db_middleware, changePassword)
router.post('/login',db_middleware, loginUser)
router.post('/forgotPassword',db_middleware, forgotPassword)
router.post('/getAllUser', protect,db_middleware, getAllUser)
router.get('/:id', protect,db_middleware, getUserById)
router.post('/removeUser', protect,db_middleware, removeUser)
router.post('/addOrganization',db_middleware, addOrganizationUser)
router.post('/checkOrganization',checkOrganization)

module.exports = router
