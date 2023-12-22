const asyncHandler = require('express-async-handler')
const Master = require('../models/masterModel')
const Product = Master.ProductModal;
const Type = Master.TypeModal;
const State = Master.StateModal;
const Source = Master.SourceModal;
const Unit = Master.UnitModal;
const Category = Master.CategoryModal;
const SubCategory = Master.SubCategoryModal;
const Module = Master.ModuleModal;
const Response = require('../models/responseModel')
const User = require('../models/userModel')

const addProduct = asyncHandler(async (req, res) => {
    let response = new Response();

    try {
        let oldProduct = await Product.findOne({ Name: req.body.name });

        if (oldProduct) {
            response.message = "Product with same name already exist.";
            return res.status(400).json(response);
        }
        let newProduct = await Product.create({
            Name: req.body.name,
            Code: req.body.code,
            Category: req.body.category,
            SubCategory: req.body.subCategory,
            PurchasePrice: req.body.purchasePrice,
            SalePrice: req.body.salePrice,
            Tax: req.body.tax,
            MinStock: req.body.minStock,
            MaxStock: req.body.maxStock,
            AvailableStock: req.body.availableStock,
            Description: req.body.description,
            is_active: true,
        });

        response.success = true;
        response.message = "Product added successfully";
        response.data = newProduct;
        return res.status(200).json(response);
    } catch (err) {
        response.message = "Error in adding product. " + err.message;
        return res.status(400).json(response);
    }

});

const editProduct = asyncHandler(async (req, res) => {
    let response = new Response();

    try {
        let oldProduct = Product.findById(req.body.id);

        if (!oldProduct) {
            response.message = "Product not found.";
            return res.status(400).json(response);
        }

        let newProduct = await Product.findByIdAndUpdate(req.body.id, {
            Name: req.body.name,
            Code: req.body.code,
            Category: req.body.category,
            SubCategory: req.body.subCategory,
            PurchasePrice: req.body.purchasePrice,
            SalePrice: req.body.salePrice,
            Tax: req.body.tax,
            MinStock: req.body.minStock,
            MaxStock: req.body.maxStock,
            AvailableStock: req.body.availableStock,
            Description: req.body.description,
            is_active: true,
        });

        response.success = true;
        response.message = "Product updated successfully";
        return res.status(200).json(response);
    } catch (err) {
        response.message = "Error in updating product. " + err.message;
        return res.status(400).json(response);
    }

});

const changeProductStatus = asyncHandler(async (req, res) => {
    let response = new Response();

    try {
        let newProduct = await Product.findByIdAndUpdate(req.body.id, {
            is_active: req.body.active
        });

        response.success = true;
        response.message = "Product status updated successfully";
        return res.status(200).json(response);
    }
    catch (err) {
        response.message = "Error in updating status. " + err.message;
        return res.status(400).json(response);
    }

})

const getProduct = asyncHandler(async (req, res) => {
    let response = new Response();

    try {
        let products = await Product.find({ is_active: req.body.active }).sort({ createdAt: -1 });

        response.success = true;
        response.data = products;
        return res.status(200).json(response);
    }
    catch (err) {
        response.message = "Error in getting products. " + err.message;
        return res.status(400).json(response);
    }
})

const getProductById = asyncHandler(async (req, res) => {
    let response = new Response();

    try {
        let products = await Product.findOne({ is_active: true, _id: req.params.id });

        response.success = true;
        response.data = products;
        return res.status(200).json(response);
    }
    catch (err) {
        response.message = "Error in getting product by id. " + err.message;
        return res.status(400).json(response);
    }
})
const addType = asyncHandler(async (req, res) => {
    let response = new Response();

    try {
        let oldType = await Type.findOne({ Name: req.body.name });

        if (oldType) {
            response.message = "Type with same name already exist.";
            return res.status(400).json(response);
        }
        let newType = await Type.create({
            Name: req.body.name,
            is_active: true,
        });

        response.success = true;
        response.message = "Type added successfully";
        response.data = newType;
        return res.status(200).json(response);
    } catch (err) {
        response.message = "Error in adding Type. " + err.message;
        return res.status(400).json(response);
    }

});

const editType = asyncHandler(async (req, res) => {
    let response = new Response();

    try {
        let oldType = Type.findById(req.body.id);

        if (!oldType) {
            response.message = "Type not found.";
            return res.status(400).json(response);
        }

        let newType = await Type.findByIdAndUpdate(req.body.id, {
            Name: req.body.name,
            is_active: true,
        });

        response.success = true;
        response.message = "Type updated successfully";
        return res.status(200).json(response);
    } catch (err) {
        response.message = "Error in updating Type. " + err.message;
        return res.status(400).json(response);
    }

});

const changeTypeStatus = asyncHandler(async (req, res) => {
    let response = new Response();

    try {
        let newType = await Type.findByIdAndUpdate(req.body.id, {
            is_active: req.body.active
        });

        response.success = true;
        response.message = "Type status updated successfully";
        return res.status(200).json(response);
    }
    catch (err) {
        response.message = "Error in updating status. " + err.message;
        return res.status(400).json(response);
    }

})

const getType = asyncHandler(async (req, res) => {
    let response = new Response();

    try {
        let Types = await Type.find({ is_active: req.body.active }).sort({ createdAt: -1 });

        response.success = true;
        response.data = Types;
        return res.status(200).json(response);
    }
    catch (err) {
        response.message = "Error in getting Type. " + err.message;
        return res.status(400).json(response);
    }
})

const getTypeById = asyncHandler(async (req, res) => {
    let response = new Response();

    try {
        let Types = await Type.findOne({ is_active: true, _id: req.params.id });

        response.success = true;
        response.data = Types;
        return res.status(200).json(response);
    }
    catch (err) {
        response.message = "Error in getting Type by id. " + err.message;
        return res.status(400).json(response);
    }
})

const addSource = asyncHandler(async (req, res) => {
    let response = new Response();

    try {
        let oldSource = await Source.findOne({ Name: req.body.name });

        if (oldSource) {
            response.message = "Source with same name already exist.";
            return res.status(400).json(response);
        }

        let newSource = await Source.create({
            Name: req.body.name,
            is_active: true,
        });

        response.success = true;
        response.message = "Source added successfully";
        response.data = newSource;
        return res.status(200).json(response);
    } catch (err) {
        response.message = "Error in adding source. " + err.message;
        return res.status(400).json(response);
    }

});

const editSource = asyncHandler(async (req, res) => {
    let response = new Response();

    try {
        let oldSource = Source.findById(req.body.id);

        if (!oldSource) {
            response.message = "Source not found.";
            return res.status(400).json(response);
        }

        let newSource = await Source.findByIdAndUpdate(req.body.id, {
            Name: req.body.name
        });

        response.success = true;
        response.message = "Source added successfully";
        response.data = newSource;
        return res.status(200).json(response);
    } catch (err) {
        response.message = "Error in updating source. " + err.message;
        return res.status(400).json(response);
    }

});

const changeSourceStatus = asyncHandler(async (req, res) => {
    let response = new Response();

    try {
        let newSource = await Source.findByIdAndUpdate(req.body.id, {
            is_active: req.body.active
        });

        response.success = true;
        response.message = "Source status updated successfully";
        return res.status(200).json(response);
    }
    catch (err) {
        response.message = "Error in updating status. " + err.message;
        return res.status(400).json(response);
    }

})

const getSources = asyncHandler(async (req, res) => {
    let response = new Response();

    try {
        let sources = await Source.find({ is_active: "true" });

        response.success = true;
        response.data = sources;
        return res.status(200).json(response);
    }
    catch (err) {
        response.message = "Error in getting sources. " + err.message;
        return res.status(400).json(response);
    }
})

const getSourceById = asyncHandler(async (req, res) => {
    let response = new Response();

    try {
        let sources = await Source.findOne({ is_active: true, _id: req.params.id });

        response.success = true;
        response.data = sources;
        return res.status(200).json(response);
    }
    catch (err) {
        response.message = "Error in getting source by id. " + err.message;
        return res.status(400).json(response);
    }
})
const addState = asyncHandler(async (req, res) => {
    let response = new Response();

    try {
        let oldState = await State.findOne({ Name: req.body.name });

        if (oldState) {
            response.message = "State with same name already exist.";
            return res.status(400).json(response);
        }

        let newState = await State.create({
            Name: req.body.name,
            is_active: true,
        });

        response.success = true;
        response.message = "State added successfully";
        response.data = newState;
        return res.status(200).json(response);
    } catch (err) {
        response.message = "Error in adding State. " + err.message;
        return res.status(400).json(response);
    }

});
const editState = asyncHandler(async (req, res) => {
    let response = new Response();

    try {
        let oldState = State.findById(req.body.id);

        if (!oldState) {
            response.message = "State not found.";
            return res.status(400).json(response);
        }

        let newState = await State.findByIdAndUpdate(req.body.id, {
            Name: req.body.name
        });

        response.success = true;
        response.message = "State added successfully";
        response.data = newState;
        return res.status(200).json(response);
    } catch (err) {
        response.message = "Error in updating State. " + err.message;
        return res.status(400).json(response);
    }

});

const getStates = asyncHandler(async (req, res) => {
    let response = new Response();

    try {
        let States = await State.find({ is_active: "true" });

        response.success = true;
        response.data = States;
        return res.status(200).json(response);
    }
    catch (err) {
        response.message = "Error in getting State. " + err.message;
        return res.status(400).json(response);
    }
})

const getStateById = asyncHandler(async (req, res) => {
    let response = new Response();

    try {
        let States = await State.findOne({ is_active: true, _id: req.params.id });

        response.success = true;
        response.data = States;
        return res.status(200).json(response);
    }
    catch (err) {
        response.message = "Error in getting State by id. " + err.message;
        return res.status(400).json(response);
    }
})
const getSales = asyncHandler(async (req, res) => {
    let response = new Response();

    try {
        let sources = await User.find({ is_active: true, role: "Sales" });

        response.success = true;
        response.data = sources;
        return res.status(200).json(response);
    }
    catch (err) {
        response.message = "Error in getting Sales. " + err.message;
        return res.status(400).json(response);
    }
})
const getProjectrole = asyncHandler(async (req, res) => {
    let response = new Response();
    var condition = ["Project Manager", "Worker", "Sales"]
    try {
        let sources = await User.find({ is_active: true, role: condition });

        response.success = true;
        response.data = sources;
        return res.status(200).json(response);
    }
    catch (err) {
        response.message = "Error in getting project manager. " + err.message;
        return res.status(400).json(response);
    }
})
const addUnit = asyncHandler(async (req, res) => {
    let response = new Response();

    try {
        let oldUnit = await Unit.findOne({ Name: req.body.name });

        if (oldUnit) {
            response.message = "Unit with same name already exist.";
            return res.status(400).json(response);
        }

        let newUnit = await Unit.create({
            Name: req.body.name,
            is_active: true,
        });

        response.success = true;
        response.message = "Unit added successfully";
        response.data = newUnit;
        return res.status(200).json(response);
    } catch (err) {
        response.message = "Error in adding source. " + err.message;
        return res.status(400).json(response);
    }

});

const editUnit = asyncHandler(async (req, res) => {
    let response = new Response();

    try {
        let oldUnit = Unit.findById(req.body.id);

        if (!oldUnit) {
            response.message = "Unit not found.";
            return res.status(400).json(response);
        }

        let newUnit = await Unit.findByIdAndUpdate(req.body.id, {
            Name: req.body.name
        });

        response.success = true;
        response.message = "Unit added successfully";
        response.data = newUnit;
        return res.status(200).json(response);
    } catch (err) {
        response.message = "Error in updating source. " + err.message;
        return res.status(400).json(response);
    }

});

const changeUnitStatus = asyncHandler(async (req, res) => {
    let response = new Response();

    try {
        let newUnit = await Unit.findByIdAndUpdate(req.body.id, {
            is_active: req.body.active
        });

        response.success = true;
        response.message = "Unit status updated successfully";
        return res.status(200).json(response);
    }
    catch (err) {
        response.message = "Error in updating status. " + err.message;
        return res.status(400).json(response);
    }

})

const getUnits = asyncHandler(async (req, res) => {
    let response = new Response();

    try {
        let sources = await Unit.find({ is_active: "true" });

        response.success = true;
        response.data = sources;
        return res.status(200).json(response);
    }
    catch (err) {
        response.message = "Error in getting sources. " + err.message;
        return res.status(400).json(response);
    }
})

const getUnitById = asyncHandler(async (req, res) => {
    let response = new Response();

    try {
        let sources = await Unit.findOne({ is_active: true, _id: req.params.id });

        response.success = true;
        response.data = sources;
        return res.status(200).json(response);
    }
    catch (err) {
        response.message = "Error in getting source by id. " + err.message;
        return res.status(400).json(response);
    }
})

const addCategory = asyncHandler(async (req, res) => {
    let response = new Response();

    try {
        let oldCategory = await Category.findOne({ Name: req.body.name });

        if (oldCategory) {
            response.message = "Category with same name already exist.";
            return res.status(400).json(response);
        }

        let newCategory = await Category.create({
            Name: req.body.name,
            is_active: true,
        });

        response.success = true;
        response.message = "Category added successfully";
        response.data = newCategory;
        return res.status(200).json(response);
    } catch (err) {
        response.message = "Error in adding source. " + err.message;
        return res.status(400).json(response);
    }

});

const editCategory = asyncHandler(async (req, res) => {
    let response = new Response();

    try {
        let oldCategory = Category.findById(req.body.id);

        if (!oldCategory) {
            response.message = "Category not found.";
            return res.status(400).json(response);
        }

        let newCategory = await Category.findByIdAndUpdate(req.body.id, {
            Name: req.body.name
        });

        response.success = true;
        response.message = "Category added successfully";
        response.data = newCategory;
        return res.status(200).json(response);
    } catch (err) {
        response.message = "Error in updating source. " + err.message;
        return res.status(400).json(response);
    }

});

const changeCategoryStatus = asyncHandler(async (req, res) => {
    let response = new Response();

    try {
        let newCategory = await Category.findByIdAndUpdate(req.body.id, {
            is_active: req.body.active
        });

        response.success = true;
        response.message = "Category status updated successfully";
        return res.status(200).json(response);
    }
    catch (err) {
        response.message = "Error in updating status. " + err.message;
        return res.status(400).json(response);
    }

})

const getCategorys = asyncHandler(async (req, res) => {
    let response = new Response();

    try {
        let sources = await Category.find({ is_active: req.body.active }).populate("subCategory");

        response.success = true;
        response.data = sources;
        return res.status(200).json(response);
    }
    catch (err) {
        response.message = "Error in getting sources. " + err.message;
        return res.status(400).json(response);
    }
})

const getCategoryById = asyncHandler(async (req, res) => {
    let response = new Response();

    try {
        let sources = await Category.findOne({ is_active: true, _id: req.params.id }).populate("subCategory");

        response.success = true;
        response.data = sources;
        return res.status(200).json(response);
    }
    catch (err) {
        response.message = "Error in getting source by id. " + err.message;
        return res.status(400).json(response);
    }
})

const addSubCategory = asyncHandler(async (req, res) => {
    let response = new Response();

    try {
        let oldSubCategory = await SubCategory.findOne({ Name: req.body.name, Category: req.body.category });

        if (oldSubCategory) {
            response.message = "SubCategory with same name already exist.";
            return res.status(400).json(response);
        }

        let newSubCategory = await SubCategory.create({
            Name: req.body.name,
            Category: req.body.category,
            is_active: true,
        });
        let category = await Category.findById(req.body.category);
        category.subCategory.push(newSubCategory);
        category.save((err) => {
            if (err) throw err;
        });
        response.success = true;
        response.message = "SubCategory added successfully";
        response.data = newSubCategory;
        return res.status(200).json(response);
    } catch (err) {
        response.message = "Error in adding source. " + err.message;
        return res.status(400).json(response);
    }

});

const editSubCategory = asyncHandler(async (req, res) => {
    let response = new Response();

    try {
        let oldSubCategory = SubCategory.findById(req.body.id);

        if (!oldSubCategory) {
            response.message = "SubCategory not found.";
            return res.status(400).json(response);
        }

        let newSubCategory = await SubCategory.findByIdAndUpdate(req.body.id, {
            Name: req.body.name
        });

        response.success = true;
        response.message = "SubCategory added successfully";
        response.data = newSubCategory;
        return res.status(200).json(response);
    } catch (err) {
        response.message = "Error in updating source. " + err.message;
        return res.status(400).json(response);
    }

});

const changeSubCategoryStatus = asyncHandler(async (req, res) => {
    let response = new Response();

    try {
        let newSubCategory = await SubCategory.findByIdAndUpdate(req.body.id, {
            is_active: req.body.active
        });

        response.success = true;
        response.message = "SubCategory status updated successfully";
        return res.status(200).json(response);
    }
    catch (err) {
        response.message = "Error in updating status. " + err.message;
        return res.status(400).json(response);
    }

})

const getSubCategorys = asyncHandler(async (req, res) => {
    let response = new Response();

    try {
        let sources = await SubCategory.find({ is_active: req.body.active });

        response.success = true;
        response.data = sources;
        return res.status(200).json(response);
    }
    catch (err) {
        response.message = "Error in getting sources. " + err.message;
        return res.status(400).json(response);
    }
})

const getSubCategoryById = asyncHandler(async (req, res) => {
    let response = new Response();

    try {
        let sources = await SubCategory.findOne({ is_active: true, _id: req.params.id });

        response.success = true;
        response.data = sources;
        return res.status(200).json(response);
    }
    catch (err) {
        response.message = "Error in getting source by id. " + err.message;
        return res.status(400).json(response);
    }
})
const addModule = asyncHandler(async (req, res) => {
    let response = new Response();
    try {
        let oldModule = await Module.findOne({ Name: req.body.name, GroupName: req.body.groupname });

        if (oldModule) {
            response.message = "Module with same name already exist.";
            return res.status(400).json(response);
        }

        let newModule = await Module.create({
            Name: req.body.name,
            GroupName: req.body.groupname,
            is_active: true,
        });
        response.success = true;
        response.message = "Module added successfully";
        response.data = newModule;
        return res.status(200).json(response);
    } catch (err) {
        response.message = "Error in adding source. " + err.message;
        return res.status(400).json(response);
    }
});

const editModule = asyncHandler(async (req, res) => {
    let response = new Response();

    try {
        let oldModule = Module.findById(req.body.id);

        if (!oldModule) {
            response.message = "Module not found.";
            return res.status(400).json(response);
        }

        let newModule = await Module.findByIdAndUpdate(req.body.id, {
            Name: req.body.name
        });

        response.success = true;
        response.message = "Module added successfully";
        response.data = newModule;
        return res.status(200).json(response);
    } catch (err) {
        response.message = "Error in updating source. " + err.message;
        return res.status(400).json(response);
    }

});

const changeModuleStatus = asyncHandler(async (req, res) => {
    let response = new Response();

    try {
        let newModule = await Module.findByIdAndUpdate(req.body.id, {
            is_active: req.body.active
        });

        response.success = true;
        response.message = "Module status updated successfully";
        return res.status(200).json(response);
    }
    catch (err) {
        response.message = "Error in updating status. " + err.message;
        return res.status(400).json(response);
    }

})

const getModule = asyncHandler(async (req, res) => {
    let response = new Response();

    try {
        let sources = await Module.find({ is_active: req.body.active });

        response.success = true;
        response.data = sources;
        return res.status(200).json(response);
    }
    catch (err) {
        response.message = "Error in getting sources. " + err.message;
        return res.status(400).json(response);
    }
})
const getModulegroup = asyncHandler(async (req, res) => {
    let response = new Response();
    try {
        const sources = await Module.aggregate([
            {
                $group: {
                    _id: "$GroupName",
                    obj: {
                        $push: "$$ROOT",
                    },
                },
            },
        ]);
        res.status(200).json(sources).end();
    }
    catch (err) {
        response.message = "Error in getting sources. " + err.message;
        return res.status(400).json(response);
    }
})
const getModuleById = asyncHandler(async (req, res) => {
    let response = new Response();

    try {
        let sources = await Module.findOne({ is_active: true, _id: req.params.id });

        response.success = true;
        response.data = sources;
        return res.status(200).json(response);
    }
    catch (err) {
        response.message = "Error in getting source by id. " + err.message;
        return res.status(400).json(response);
    }
})
module.exports = {
    addProduct,
    editProduct,
    changeProductStatus,
    getProduct,
    getProductById,
    addType,
    editType,
    changeTypeStatus,
    getType,
    getTypeById,
    addSource,
    editSource,
    changeSourceStatus,
    getSources,
    getSourceById,
    addUnit,
    editUnit,
    changeUnitStatus,
    getUnits,
    getUnitById,
    getSales,
    getProjectrole,
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
    addModule,
    editModule,
    changeModuleStatus,
    getModule,
    getModuleById,
    getModulegroup
}