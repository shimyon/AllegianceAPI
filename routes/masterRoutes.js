const express = require('express')
const router = express.Router()

const {
    addProduct,
    editProduct,
    changeProductStatus,
    addSource,
    editSource,
    getProduct,
    getProductById,
    getSources,
    getSourceById,
    addUnit,
    editUnit,
    changeUnitStatus,
    getUnits,
    getUnitById,
    changeSourceStatus,
    addCategory,
    editCategory,
    changeCategoryStatus,
    getCategorys,
    getCategoryById,
    addSubCategory,
    editSubCategory,
    changeSubCategoryStatus,
    getSubCategorys,
    getSubCategoryById,
    addState,
    editState,
    getStates,
    getStateById,
    addType,
    editType,
    changeTypeStatus,
    getType,
    getTypeById,
    addModule,
    editModule,
    changeModuleStatus,
    getModule,
    getModuleById,
    getModulegroup,
    addRole,
    editRole,
    changeRoleStatus,
    getRoles,
    getRoleById,
    addStatus,
    editStatus,
    changeStatus,
    getStatus,
    getStatusById,
} = require('../controllers/masterController')
const { protect } = require('../middleware/authMiddleware')

router.post('/addProduct', protect, addProduct)
router.post('/editProduct', protect, editProduct)
router.post('/changeProductStatus', protect, changeProductStatus)
router.post('/getProduct', protect, getProduct)
router.get('/product/:id', protect, getProductById)

router.post('/addType', protect, addType)
router.post('/editType', protect, editType)
router.post('/changeTypeStatus', protect, changeTypeStatus)
router.post('/getType', protect, getType)
router.get('/Type/:id', protect, getTypeById)

router.post('/addSource', protect, addSource)
router.post('/editSource', protect, editSource)
router.post('/changeSourceStatus', protect, changeSourceStatus)
router.post('/getSource', protect, getSources)
router.get('/source/:id', protect, getSourceById)

router.post('/addState', protect, addState)
router.post('/editState', protect, editState)
router.get('/getState', protect, getStates)
router.get('/state/:id', protect, getStateById)

router.post('/addUnit', protect, addUnit)
router.post('/editUnit', protect, editUnit)
router.post('/changeUnitStatus', protect, changeUnitStatus)
router.post('/getUnit', protect, getUnits)
router.get('/unit/:id', protect, getUnitById)

router.post('/addCategory', protect, addCategory)
router.post('/editCategory', protect, editCategory)
router.post('/changeCategoryStatus', protect, changeCategoryStatus)
router.post('/getCategorys', protect, getCategorys)
router.get('/category/:id', protect, getCategoryById)

router.post('/addSubCategory', protect, addSubCategory)
router.post('/editSubCategory', protect, editSubCategory)
router.post('/changeSubCategoryStatus', protect, changeSubCategoryStatus)
router.post('/getSubCategorys', protect, getSubCategorys)
router.get('/subcategory/:id', protect, getSubCategoryById)

router.post('/addModule', protect, addModule)
router.post('/editModule', protect, editModule)
router.post('/changeModuleStatus', protect, changeModuleStatus)
router.post('/getModule', protect, getModule)
router.get('/Module/:id', protect, getModuleById)
router.get('/getModulegroup', protect, getModulegroup)

router.post('/addRole', protect, addRole)
router.post('/editRole', protect, editRole)
router.post('/changeRoleStatus', protect, changeRoleStatus)
router.post('/getRole', protect, getRoles)
router.get('/Role/:id', protect, getRoleById)

router.post('/addStatus', protect, addStatus)
router.post('/editStatus', protect, editStatus)
router.post('/changeStatus', protect, changeStatus)
router.post('/getStatus', protect, getStatus)
router.get('/Status/:id', protect, getStatusById)

module.exports = router
