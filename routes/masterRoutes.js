const express = require('express')
const router = express.Router()

const { 
    addProduct,
    editProduct,
    changeProductStatus,
    getProduct,
    getProductById,
    deleteProduct,
    addSource,
    editSource,
    changeSourceStatus,
    getSources,
    getSourceById,
    deleteSource,
    addUnit,
    editUnit,
    changeUnitStatus,
    getUnits,
    getUnitById,
    deleteUnit,
    addQuatationName,
    editQuatationName,
    changeQuatationNameStatus,
    getQuatationNames,
    getQuatationNameById,
    deleteQuatationName,
    addCategory,
    editCategory,
    changeCategoryStatus,
    getCategorys,
    getCategoryById,
    deleteCategory,
    addSubCategory,
    editSubCategory,
    changeSubCategoryStatus,
    getSubCategorys,
    getSubCategoryById,
    deleteSubCategory,
    addIcon,
    editIcon,
    changeIconStatus,
    getIcons,
    getIconById,
    deleteIcon,
    addCountry,
    editCountry,
    changeCountryStatus,
    getCountrys,
    getCountryById,
    deleteCountry,
    addState,
    editState,
    changeStateStatus,
    getStates,
    getStateById,
    deleteState,
    addCity,
    editCity,
    changeCityStatus,
    getCitys,
    getCityById,
    deleteCity,
    addType,
    editType,
    changeTypeStatus,
    getType,
    getTypeById,
    deleteType,
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
    deleteRole,
    addStatus,
    editStatus,
    changeStatus,
    getStatus,
    getStatusById,
    deleteStatus,
    editConfigurationStatus,
    addMailAddress,
    editMailAddress,
    changeMailAddressStatus,
    getMailAddress,
    getMailAddressById,
    setDefaultMailAddress,
    getApplicationSetting,
    addApplicationSetting
} = require('../controllers/masterController')
const { protect } = require('../middleware/authMiddleware')
// const db_middleware = require('../middleware/establish');
router.get('/getApplicationSetting', protect, getApplicationSetting)
router.post('/addApplicationSetting', protect, addApplicationSetting)

router.post('/addProduct', protect, addProduct)
router.post('/editProduct', protect, editProduct)
router.post('/changeProductStatus', protect, changeProductStatus)
router.post('/getProduct', protect, getProduct)
router.get('/product/:id', protect, getProductById)
router.get('/deleteProduct/:id', protect, deleteProduct)

router.post('/addType', protect, addType)
router.post('/editType', protect, editType)
router.post('/changeTypeStatus', protect, changeTypeStatus)
router.post('/getType', protect, getType)
router.get('/Type/:id', protect, getTypeById)
router.get('/deleteType/:id', protect, deleteType)

router.post('/addSource', protect, addSource)
router.post('/editSource', protect, editSource)
router.post('/changeSourceStatus', protect, changeSourceStatus)
router.post('/getSource', protect, getSources)
router.get('/source/:id', protect, getSourceById)
router.get('/deleteSource/:id', protect, deleteSource)

router.post('/addCountry', protect, addCountry)
router.post('/editCountry', protect, editCountry)
router.post('/changeCountryStatus', protect, changeCountryStatus)
router.post('/getCountry', protect, getCountrys)
router.get('/Country/:id', protect, getCountryById)
router.get('/deleteCountry/:id', protect, deleteCountry)

router.post('/addState', protect, addState)
router.post('/editState', protect, editState)
router.post('/changeStateStatus', protect, changeStateStatus)
router.post('/getState', protect, getStates)
router.get('/state/:id', protect, getStateById)
router.get('/deleteState/:id', protect, deleteState)

router.post('/addCity', protect, addCity)
router.post('/editCity', protect, editCity)
router.post('/changeCityStatus', protect, changeCityStatus)
router.post('/getCity', protect, getCitys)
router.get('/city/:id', protect, getCityById)
router.get('/deleteCity/:id', protect, deleteCity)

router.post('/addUnit', protect, addUnit)
router.post('/editUnit', protect, editUnit)
router.post('/changeUnitStatus', protect, changeUnitStatus)
router.post('/getUnit', protect, getUnits)
router.get('/unit/:id', protect, getUnitById)
router.get('/deleteUnit/:id', protect, deleteUnit)

router.post('/addQuatationName', protect, addQuatationName)
router.post('/editQuatationName', protect, editQuatationName)
router.post('/changeQuatationNameStatus', protect, changeQuatationNameStatus)
router.post('/getQuatationName', protect, getQuatationNames)
router.get('/QuatationName/:id', protect, getQuatationNameById)
router.get('/deleteQuatationName/:id', protect, deleteQuatationName)

router.post('/addCategory', protect, addCategory)
router.post('/editCategory', protect, editCategory)
router.post('/changeCategoryStatus', protect, changeCategoryStatus)
router.post('/getCategorys', protect, getCategorys)
router.get('/category/:id', protect, getCategoryById)
router.get('/deleteCategory/:id', protect, deleteCategory)

router.post('/addSubCategory', protect, addSubCategory)
router.post('/editSubCategory', protect, editSubCategory)
router.post('/changeSubCategoryStatus', protect, changeSubCategoryStatus)
router.post('/getSubCategorys', protect, getSubCategorys)
router.get('/subcategory/:id', protect, getSubCategoryById)
router.get('/deleteSubCategory/:id', protect, deleteSubCategory)

router.post('/addIcon', protect, addIcon)
router.post('/editIcon', protect, editIcon)
router.post('/changeIconStatus', protect, changeIconStatus)
router.post('/getIcon', protect, getIcons)
router.get('/icon/:id', protect, getIconById)
router.get('/deleteIcon/:id', protect, deleteIcon)

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
router.get('/deleteRole/:id', protect, deleteRole)

router.post('/addStatus', protect, addStatus)
router.post('/editStatus', protect, editStatus)
router.post('/changeStatus', protect, changeStatus)
router.post('/getStatus', protect, getStatus)
router.get('/Status/:id', protect, getStatusById)
router.get('/deleteStatus/:id', protect, deleteStatus)
router.post('/editConfigurationStatus', protect, editConfigurationStatus)

router.post('/addMailAddress', protect, addMailAddress)
router.post('/editMailAddress', protect, editMailAddress)
router.post('/changeMailAddressStatus', protect, changeMailAddressStatus)
router.post('/getMailAddress', protect, getMailAddress)
router.get('/MailAddress/:id', protect, getMailAddressById)
router.post('/setDefaultMailAddress', protect, setDefaultMailAddress)

module.exports = router
