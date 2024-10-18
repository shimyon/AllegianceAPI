const express = require('express')
const router = express.Router()

const {
    AddModuleRight,
    GetModuleRightByRole,
} = require('../controllers/ModuleRightController')
const { protect } = require('../middleware/authMiddleware')
const db_middleware = require('../middleware/establish')

router.post('/AddModuleRight', protect, AddModuleRight)
router.get('/GetModuleRightByRole/:role', db_middleware, protect, GetModuleRightByRole)

module.exports = router
