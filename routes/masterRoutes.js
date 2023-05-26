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
    getExecutive,
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
    getSubCategoryById
 } = require('../controllers/masterController')
const { protect } = require('../middleware/authMiddleware')

router.get('/getExecutive', protect, getExecutive)

router.post('/addProduct', protect, addProduct)
router.post('/editProduct', protect, editProduct)
router.post('/changeProductStatus', protect, changeProductStatus)
router.post('/getProduct', protect, getProduct)
router.get('/product/:id', protect, getProductById)

router.post('/addSource', protect, addSource)
router.post('/editSource', protect, editSource)
router.post('/changeSourceStatus', protect, changeSourceStatus)
router.get('/getSource', protect, getSources)
router.get('/source/:id', protect, getSourceById)


router.post('/addUnit', protect, addUnit)
router.post('/editUnit', protect, editUnit)
router.post('/changeUnitStatus', protect, changeUnitStatus)
router.get('/getUnit', protect, getUnits)
router.get('/unit/:id', protect, getUnitById)

router.post('/addCategory', protect, addCategory)
router.post('/editCategory', protect, editCategory)
router.post('/changeCategoryStatus', protect, changeCategoryStatus)
router.get('/getCategorys', protect, getCategorys)
router.get('/category/:id', protect, getCategoryById)

router.post('/addSubCategory', protect, addSubCategory)
router.post('/editSubCategory', protect, editSubCategory)
router.post('/changeSubCategoryStatus', protect, changeSubCategoryStatus)
router.get('/getSubCategorys', protect, getSubCategorys)
router.get('/subcategory/:id', protect, getSubCategoryById)

module.exports = router
