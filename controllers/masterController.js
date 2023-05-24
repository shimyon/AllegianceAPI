const asyncHandler = require('express-async-handler')
const Master = require('../models/masterModel')
const Product = Master.ProductModal;
const Source = Master.SourceModal;
const Unit = Master.UnitModal;
const Response = require('../models/responseModel')
const User = require('../models/userModel')

const addProduct = asyncHandler(async (req, res) => {
    let response = new Response();

    try {
        let oldProduct = await Product.findOne({ Name: {$regex:req.body.name,$options:'i'} });

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
        let products = await Product.find({is_active:req.body.active});

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
        let products = await Product.findOne({is_active:true,_id:req.params.id});

        response.success = true;
        response.data = products;
        return res.status(200).json(response);
    }
    catch (err) {
        response.message = "Error in getting product by id. " + err.message;
        return res.status(400).json(response);
    }
})

const addSource = asyncHandler(async (req, res) => {
    let response = new Response();

    try {
        let oldSource = await Source.findOne({ Name: {$regex:req.body.name,$options:'i'} });

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

        let newSource = await Source.findByIdAndUpdate(req.body.id,{
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
        let sources = await Source.find({is_active:"true"});

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
        let sources = await Source.findOne({is_active:true,_id:req.params.id});

        response.success = true;
        response.data = sources;
        return res.status(200).json(response);
    }
    catch (err) {
        response.message = "Error in getting source by id. " + err.message;
        return res.status(400).json(response);
    }
})

const getExecutive = asyncHandler(async (req, res) => {
    let response = new Response();

    try {
        let sources = await User.find({is_active:true,role:"executive"});

        response.success = true;
        response.data = sources;
        return res.status(200).json(response);
    }
    catch (err) {
        response.message = "Error in getting executive. " + err.message;
        return res.status(400).json(response);
    }
})

const addUnit = asyncHandler(async (req, res) => {
    let response = new Response();

    try {
        let oldUnit = await Unit.findOne({ Name: {$regex:req.body.name,$options:'i'} });

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

        let newUnit = await Unit.findByIdAndUpdate(req.body.id,{
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
        let sources = await Unit.find({is_active:"true"});

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
        let sources = await Unit.findOne({is_active:true,_id:req.params.id});

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
    getExecutive
}