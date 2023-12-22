const express = require('express')
const router = express.Router()

const { 
    AddModuleRight,
    GetModuleRightByRole,
 } = require('../controllers/ModuleRightController')
const { protect } = require('../middleware/authMiddleware')

router.post('/AddModuleRight', protect, AddModuleRight)
router.get('/GetModuleRightByRole/:role', protect, GetModuleRightByRole)

module.exports = router
