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
const db_middleware = require('../middleware/establish')

router.get('/getApplicationSetting', db_middleware, protect, getApplicationSetting)
router.post('/addApplicationSetting', db_middleware, protect, addApplicationSetting)

router.post('/addProduct', db_middleware, protect, addProduct)
router.post('/editProduct', db_middleware, protect, editProduct)
router.post('/changeProductStatus', db_middleware, protect, changeProductStatus)
router.post('/getProduct', db_middleware, protect, getProduct)
router.get('/product/:id', db_middleware, protect, getProductById)
router.get('/deleteProduct/:id', db_middleware, protect, deleteProduct)

router.post('/addType', db_middleware, protect, addType)
router.post('/editType', db_middleware, protect, editType)
router.post('/changeTypeStatus', db_middleware, protect, changeTypeStatus)
router.post('/getType', db_middleware, protect, getType)
router.get('/Type/:id', db_middleware, protect, getTypeById)
router.get('/deleteType/:id', db_middleware, protect, deleteType)

router.post('/addSource', db_middleware, protect, addSource)
router.post('/editSource', db_middleware, protect, editSource)
router.post('/changeSourceStatus', db_middleware, protect, changeSourceStatus)
router.post('/getSource', db_middleware, protect, getSources)
router.get('/source/:id', db_middleware, protect, getSourceById)
router.get('/deleteSource/:id', db_middleware, protect, deleteSource)

router.post('/addCountry', db_middleware, protect, addCountry)
router.post('/editCountry', db_middleware, protect, editCountry)
router.post('/changeCountryStatus', db_middleware, protect, changeCountryStatus)
router.post('/getCountry', db_middleware, protect, getCountrys)
router.get('/Country/:id', db_middleware, protect, getCountryById)
router.get('/deleteCountry/:id', db_middleware, protect, deleteCountry)

router.post('/addState', db_middleware, protect, addState)
router.post('/editState', db_middleware, protect, editState)
router.post('/changeStateStatus', db_middleware, protect, changeStateStatus)
router.post('/getState', db_middleware, protect, getStates)
router.get('/state/:id', db_middleware, protect, getStateById)
router.get('/deleteState/:id', db_middleware, protect, deleteState)

router.post('/addCity', db_middleware, protect, addCity)
router.post('/editCity', db_middleware, protect, editCity)
router.post('/changeCityStatus', db_middleware, protect, changeCityStatus)
router.post('/getCity', db_middleware, protect, getCitys)
router.get('/city/:id', db_middleware, protect, getCityById)
router.get('/deleteCity/:id', db_middleware, protect, deleteCity)

router.post('/addUnit', db_middleware, protect, addUnit)
router.post('/editUnit', db_middleware, protect, editUnit)
router.post('/changeUnitStatus', db_middleware, protect, changeUnitStatus)
router.post('/getUnit', db_middleware, protect, getUnits)
router.get('/unit/:id', db_middleware, protect, getUnitById)
router.get('/deleteUnit/:id', db_middleware, protect, deleteUnit)

router.post('/addCategory', db_middleware, protect, addCategory)
router.post('/editCategory', db_middleware, protect, editCategory)
router.post('/changeCategoryStatus', db_middleware, protect, changeCategoryStatus)
router.post('/getCategorys', db_middleware, protect, getCategorys)
router.get('/category/:id', db_middleware, protect, getCategoryById)
router.get('/deleteCategory/:id', db_middleware, protect, deleteCategory)

router.post('/addSubCategory', db_middleware, protect, addSubCategory)
router.post('/editSubCategory', db_middleware, protect, editSubCategory)
router.post('/changeSubCategoryStatus', db_middleware, protect, changeSubCategoryStatus)
router.post('/getSubCategorys', db_middleware, protect, getSubCategorys)
router.get('/subcategory/:id', db_middleware, protect, getSubCategoryById)
router.get('/deleteSubCategory/:id', db_middleware, protect, deleteSubCategory)

router.post('/addIcon', db_middleware, protect, addIcon)
router.post('/editIcon', db_middleware, protect, editIcon)
router.post('/changeIconStatus', db_middleware, protect, changeIconStatus)
router.post('/getIcon', db_middleware, protect, getIcons)
router.get('/icon/:id', db_middleware, protect, getIconById)
router.get('/deleteIcon/:id', db_middleware, protect, deleteIcon)

router.post('/addModule', db_middleware, protect, addModule)
router.post('/editModule', db_middleware, protect, editModule)
router.post('/changeModuleStatus', db_middleware, protect, changeModuleStatus)
router.post('/getModule', db_middleware, protect, getModule)
router.get('/Module/:id', db_middleware, protect, getModuleById)
router.get('/getModulegroup', db_middleware, protect, getModulegroup)

router.post('/addRole', db_middleware, protect, addRole)
router.post('/editRole', db_middleware, protect, editRole)
router.post('/changeRoleStatus', db_middleware, protect, changeRoleStatus)
router.post('/getRole', db_middleware, protect, getRoles)
router.get('/Role/:id', db_middleware, protect, getRoleById)
router.get('/deleteRole/:id', db_middleware, protect, deleteRole)

router.post('/addStatus', db_middleware, protect, addStatus)
router.post('/editStatus', db_middleware, protect, editStatus)
router.post('/changeStatus', db_middleware, protect, changeStatus)
router.post('/getStatus', db_middleware, protect, getStatus)
router.get('/Status/:id', db_middleware, protect, getStatusById)
router.get('/deleteStatus/:id', db_middleware, protect, deleteStatus)
router.post('/editConfigurationStatus', db_middleware, protect, editConfigurationStatus)

router.post('/addMailAddress', db_middleware, protect, addMailAddress)
router.post('/editMailAddress', db_middleware, protect, editMailAddress)
router.post('/changeMailAddressStatus', db_middleware, protect, changeMailAddressStatus)
router.post('/getMailAddress', db_middleware, protect, getMailAddress)
router.get('/MailAddress/:id', db_middleware, protect, getMailAddressById)
router.post('/setDefaultMailAddress', db_middleware, protect, setDefaultMailAddress)

module.exports = router
