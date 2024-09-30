const asyncHandler = require('express-async-handler')
const SassMaster = require('../models/saasmasterModel');
const Master = require('../models/masterModel')
const Product = Master.ProductModal;
const Type = Master.TypeModal;
const State = Master.StateModal;
const Country = Master.CountryModal;
const City = Master.CityModal;
const Source = Master.SourceModal;
const Unit = Master.UnitModal;
const Icon = Master.IconModal;
const Category = Master.CategoryModal;
const SubCategory = Master.SubCategoryModal;
const Module = Master.ModuleModal;
const moduleRight = require('../models/moduleRightModel');
const Role = Master.RoleModal;
const Status = Master.StatusModal;
const MailAddress = Master.MailAddressModal;
const ApplicationSetting = Master.ApplicationSettingModal;
const ApplicationSettingTenant = SassMaster.ApplicationSettingModal;

const uploadFile = require("../middleware/uploadFileMiddleware");

const Response = require('../models/responseModel')


const addProduct = asyncHandler(async (req, res) => {
    let response = new Response();

    try {
        let oldProduct = await Product.findOne({ Name: req.body.name, Type: req.body.type });

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
            Type: req.body.type,
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
            Type: req.body.type,
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
        response.message = "Error in updating Product. " + err.message;
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
const deleteProduct = asyncHandler(async (req, res) => {
    try {
        await Product.deleteOne({ _id: req.params.id }).lean().exec((err, doc) => {
            if (err) {
                return res.status(401).json({
                    success: false,
                    msg: err
                }).end();
            } else {
                return res.status(200).json({
                    success: true,
                    msg: "Product removed. ",
                }).end();
            }
        });

    } catch (err) {
        return res.status(400).json({
            success: false,
            msg: "Error in removing Product. " + err.message,
            data: null,
        });
    }

});


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
        response.message = "Error in updating Type. " + err.message;
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
const deleteType = asyncHandler(async (req, res) => {
    try {
        await Type.deleteOne({ _id: req.params.id }).lean().exec((err, doc) => {
            if (err) {
                return res.status(401).json({
                    success: false,
                    msg: err
                }).end();
            } else {
                return res.status(200).json({
                    success: true,
                    msg: "Type removed. ",
                }).end();
            }
        });

    } catch (err) {
        return res.status(400).json({
            success: false,
            msg: "Error in removing Type. " + err.message,
            data: null,
        });
    }

});


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
        response.message = "Error in updating Source. " + err.message;
        return res.status(400).json(response);
    }

})
const getSources = asyncHandler(async (req, res) => {
    let response = new Response();

    try {
        let sources = await Source.find({ is_active: req.body.active });

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
const deleteSource = asyncHandler(async (req, res) => {
    try {
        await Source.deleteOne({ _id: req.params.id }).lean().exec((err, doc) => {
            if (err) {
                return res.status(401).json({
                    success: false,
                    msg: err
                }).end();
            } else {
                return res.status(200).json({
                    success: true,
                    msg: "Source removed. ",
                }).end();
            }
        });

    } catch (err) {
        return res.status(400).json({
            success: false,
            msg: "Error in removing Source. " + err.message,
            data: null,
        });
    }

});

const addCountry = asyncHandler(async (req, res) => {
    let response = new Response();

    try {
        let oldCountry = await Country.findOne({ Name: req.body.name });

        if (oldCountry) {
            response.message = "Country with same name already exist.";
            return res.status(400).json(response);
        }

        let newCountry = await Country.create({
            Name: req.body.name,
            Country: "India",
            is_active: true,
        });

        response.success = true;
        response.message = "Country added successfully";
        response.data = newCountry;
        return res.status(200).json(response);
    } catch (err) {
        response.message = "Error in adding Country. " + err.message;
        return res.status(400).json(response);
    }

});
const editCountry = asyncHandler(async (req, res) => {
    let response = new Response();

    try {
        let oldCountry = Country.findById(req.body.id);

        if (!oldCountry) {
            response.message = "Country not found.";
            return res.status(400).json(response);
        }

        let newCountry = await Country.findByIdAndUpdate(req.body.id, {
            Name: req.body.name
        });

        response.success = true;
        response.message = "Country added successfully";
        response.data = newCountry;
        return res.status(200).json(response);
    } catch (err) {
        response.message = "Error in updating Country. " + err.message;
        return res.status(400).json(response);
    }

});
const getCountrys = asyncHandler(async (req, res) => {
    let response = new Response();

    try {
        let Countrys = await Country.find({ is_active:req.body.active });

        response.success = true;
        response.data = Countrys;
        return res.status(200).json(response);
    }
    catch (err) {
        response.message = "Error in getting Country. " + err.message;
        return res.status(400).json(response);
    }
})
const getCountryById = asyncHandler(async (req, res) => {
    let response = new Response();

    try {
        let Countrys = await Country.findOne({ is_active: true, _id: req.params.id });

        response.success = true;
        response.data = Countrys;
        return res.status(200).json(response);
    }
    catch (err) {
        response.message = "Error in getting Country by id. " + err.message;
        return res.status(400).json(response);
    }
})
const changeCountryStatus = asyncHandler(async (req, res) => {
    let response = new Response();

    try {
        let newCountry = await Country.findByIdAndUpdate(req.body.id, {
            is_active: req.body.active
        });

        response.success = true;
        response.message = "Country status updated successfully";
        return res.status(200).json(response);
    }
    catch (err) {
        response.message = "Error in updating Country. " + err.message;
        return res.status(400).json(response);
    }

})
const deleteCountry = asyncHandler(async (req, res) => {
    try {
        let States = await State.find({ Country: req.params.id }).count();
        if (States != 0) {
            if (States) {
                return res.status(400).json({
                    success: false,
                    msg: "You cannot delete this record because it is already in use",
                    data: null,
                });
            }
        }
        else {
            await Country.deleteOne({ _id: req.params.id }).lean().exec((err, doc) => {
                if (err) {
                    return res.status(401).json({
                        success: false,
                        msg: err
                    }).end();
                } else {
                    return res.status(200).json({
                        success: true,
                        msg: "Country removed. ",
                    }).end();
                }
            });
        }
    } catch (err) {
        return res.status(400).json({
            success: false,
            msg: "Error in removing Country. " + err.message,
            data: null,
        });
    }

});

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
            Country: req.body.country,
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
        let States = await State.find({ is_active: req.body.active }).populate("Country");

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
const changeStateStatus = asyncHandler(async (req, res) => {
    let response = new Response();

    try {
        let newState = await State.findByIdAndUpdate(req.body.id, {
            is_active: req.body.active
        });

        response.success = true;
        response.message = "State status updated successfully";
        return res.status(200).json(response);
    }
    catch (err) {
        response.message = "Error in updating State. " + err.message;
        return res.status(400).json(response);
    }

})
const deleteState = asyncHandler(async (req, res) => {
    try {
        let Citys = await City.find({ State: req.params.id }).count();
        if (Citys != 0) {
            if (Citys) {
                return res.status(400).json({
                    success: false,
                    msg: "You cannot delete this record because it is already in use",
                    data: null,
                });
            }
        }
        else {
            await State.deleteOne({ _id: req.params.id }).lean().exec((err, doc) => {
                if (err) {
                    return res.status(401).json({
                        success: false,
                        msg: err
                    }).end();
                } else {
                    return res.status(200).json({
                        success: true,
                        msg: "State removed. ",
                    }).end();
                }
            });
        }
    } catch (err) {
        return res.status(400).json({
            success: false,
            msg: "Error in removing State. " + err.message,
            data: null,
        });
    }

});

const addCity = asyncHandler(async (req, res) => {
    let response = new Response();

    try {
        let oldCity = await City.findOne({ Name: req.body.name });

        if (oldCity) {
            response.message = "City with same name already exist.";
            return res.status(400).json(response);
        }

        let newCity = await City.create({
            Name: req.body.name,
            State: req.body.state,
            is_active: true,
        });

        response.success = true;
        response.message = "City added successfully";
        response.data = newCity;
        return res.status(200).json(response);
    } catch (err) {
        response.message = "Error in adding City. " + err.message;
        return res.status(400).json(response);
    }

});
const editCity = asyncHandler(async (req, res) => {
    let response = new Response();

    try {
        let oldCity = City.findById(req.body.id);

        if (!oldCity) {
            response.message = "City not found.";
            return res.status(400).json(response);
        }

        let newCity = await City.findByIdAndUpdate(req.body.id, {
            Name: req.body.name
        });

        response.success = true;
        response.message = "City added successfully";
        response.data = newCity;
        return res.status(200).json(response);
    } catch (err) {
        response.message = "Error in updating City. " + err.message;
        return res.status(400).json(response);
    }

});
const getCitys = asyncHandler(async (req, res) => {
    let response = new Response();

    try {
        let Citys = await City.find({ is_active: req.body.active }).populate("State");

        response.success = true;
        response.data = Citys;
        return res.status(200).json(response);
    }
    catch (err) {
        response.message = "Error in getting City. " + err.message;
        return res.status(400).json(response);
    }
})
const getCityById = asyncHandler(async (req, res) => {
    let response = new Response();

    try {
        let Citys = await City.findOne({ is_active: true, _id: req.params.id });

        response.success = true;
        response.data = Citys;
        return res.status(200).json(response);
    }
    catch (err) {
        response.message = "Error in getting City by id. " + err.message;
        return res.status(400).json(response);
    }
})
const changeCityStatus = asyncHandler(async (req, res) => {
    let response = new Response();

    try {
        let newCity = await City.findByIdAndUpdate(req.body.id, {
            is_active: req.body.active
        });

        response.success = true;
        response.message = "City status updated successfully";
        return res.status(200).json(response);
    }
    catch (err) {
        response.message = "Error in updating City. " + err.message;
        return res.status(400).json(response);
    }

})
const deleteCity = asyncHandler(async (req, res) => {
    try {
        await City.deleteOne({ _id: req.params.id }).lean().exec((err, doc) => {
            if (err) {
                return res.status(401).json({
                    success: false,
                    msg: err
                }).end();
            } else {
                return res.status(200).json({
                    success: true,
                    msg: "City removed. ",
                }).end();
            }
        });

    } catch (err) {
        return res.status(400).json({
            success: false,
            msg: "Error in removing City. " + err.message,
            data: null,
        });
    }

});


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
        response.message = "Error in adding Unit. " + err.message;
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
        response.message = "Error in updating Unit. " + err.message;
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
        response.message = "Error in updating Unit. " + err.message;
        return res.status(400).json(response);
    }

})
const getUnits = asyncHandler(async (req, res) => {
    let response = new Response();

    try {
        let Units = await Unit.find({ is_active: req.body.active });

        response.success = true;
        response.data = Units;
        return res.status(200).json(response);
    }
    catch (err) {
        response.message = "Error in getting Unit. " + err.message;
        return res.status(400).json(response);
    }
})
const getUnitById = asyncHandler(async (req, res) => {
    let response = new Response();

    try {
        let Units = await Unit.findOne({ is_active: true, _id: req.params.id });

        response.success = true;
        response.data = Units;
        return res.status(200).json(response);
    }
    catch (err) {
        response.message = "Error in getting Unit by id. " + err.message;
        return res.status(400).json(response);
    }
})
const deleteUnit = asyncHandler(async (req, res) => {
    try {
        await Unit.deleteOne({ _id: req.params.id }).lean().exec((err, doc) => {
            if (err) {
                return res.status(401).json({
                    success: false,
                    msg: err
                }).end();
            } else {
                return res.status(200).json({
                    success: true,
                    msg: "Unit removed. ",
                }).end();
            }
        });

    } catch (err) {
        return res.status(400).json({
            success: false,
            msg: "Error in removing Unit. " + err.message,
            data: null,
        });
    }

});


const addIcon = asyncHandler(async (req, res) => {
    let response = new Response();

    try {
        let oldIcon = await Icon.findOne({ Name: req.body.name });

        if (oldIcon) {
            response.message = "Icon with same name already exist.";
            return res.status(400).json(response);
        }

        let newIcon = await Icon.create({
            Name: req.body.name,
            is_active: true,
        });

        response.success = true;
        response.message = "Icon added successfully";
        response.data = newIcon;
        return res.status(200).json(response);
    } catch (err) {
        response.message = "Error in adding Icon. " + err.message;
        return res.status(400).json(response);
    }

});
const editIcon = asyncHandler(async (req, res) => {
    let response = new Response();

    try {
        let oldIcon = Icon.findById(req.body.id);

        if (!oldIcon) {
            response.message = "Icon not found.";
            return res.status(400).json(response);
        }

        let newIcon = await Icon.findByIdAndUpdate(req.body.id, {
            Name: req.body.name
        });

        response.success = true;
        response.message = "Icon added successfully";
        response.data = newIcon;
        return res.status(200).json(response);
    } catch (err) {
        response.message = "Error in updating Icon. " + err.message;
        return res.status(400).json(response);
    }

});
const changeIconStatus = asyncHandler(async (req, res) => {
    let response = new Response();

    try {
        let newIcon = await Icon.findByIdAndUpdate(req.body.id, {
            is_active: req.body.active
        });

        response.success = true;
        response.message = "Icon status updated successfully";
        return res.status(200).json(response);
    }
    catch (err) {
        response.message = "Error in updating Icon. " + err.message;
        return res.status(400).json(response);
    }

})
const getIcons = asyncHandler(async (req, res) => {
    let response = new Response();

    try {
        let Icons = await Icon.find({ is_active: req.body.active });

        response.success = true;
        response.data = Icons;
        return res.status(200).json(response);
    }
    catch (err) {
        response.message = "Error in getting Icon. " + err.message;
        return res.status(400).json(response);
    }
})
const getIconById = asyncHandler(async (req, res) => {
    let response = new Response();

    try {
        let Icons = await Icon.findOne({ is_active: true, _id: req.params.id });

        response.success = true;
        response.data = Icons;
        return res.status(200).json(response);
    }
    catch (err) {
        response.message = "Error in getting Icon by id. " + err.message;
        return res.status(400).json(response);
    }
})
const deleteIcon = asyncHandler(async (req, res) => {
    try {
        await Icon.deleteOne({ _id: req.params.id }).lean().exec((err, doc) => {
            if (err) {
                return res.status(401).json({
                    success: false,
                    msg: err
                }).end();
            } else {
                return res.status(200).json({
                    success: true,
                    msg: "Icon removed. ",
                }).end();
            }
        });

    } catch (err) {
        return res.status(400).json({
            success: false,
            msg: "Error in removing Icon. " + err.message,
            data: null,
        });
    }

});

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
        response.message = "Error in adding Category. " + err.message;
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
        response.message = "Error in updating Category. " + err.message;
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
        response.message = "Error in updating Category. " + err.message;
        return res.status(400).json(response);
    }

})
const getCategorys = asyncHandler(async (req, res) => {
    let response = new Response();

    try {
        let Categorys = await Category.find({ is_active: req.body.active });

        response.success = true;
        response.data = Categorys;
        return res.status(200).json(response);
    }
    catch (err) {
        response.message = "Error in getting Category. " + err.message;
        return res.status(400).json(response);
    }
})
const getCategoryById = asyncHandler(async (req, res) => {
    let response = new Response();

    try {
        let Categorys = await Category.findOne({ is_active: true, _id: req.params.id });

        response.success = true;
        response.data = Categorys;
        return res.status(200).json(response);
    }
    catch (err) {
        response.message = "Error in getting Category by id. " + err.message;
        return res.status(400).json(response);
    }
})
const deleteCategory = asyncHandler(async (req, res) => {
    try {
        let SubCategorys = await SubCategory.find({ Category: req.params.id }).count();
        if (SubCategorys != 0) {
            if (SubCategorys) {
                return res.status(400).json({
                    success: false,
                    msg: "You cannot delete this record because it is already in use",
                    data: null,
                });
            }
        }
        else {
        await Category.deleteOne({ _id: req.params.id }).lean().exec((err, doc) => {
            if (err) {
                return res.status(401).json({
                    success: false,
                    msg: err
                }).end();
            } else {
                return res.status(200).json({
                    success: true,
                    msg: "Category removed. ",
                }).end();
            }
        });
    }
    } catch (err) {
        return res.status(400).json({
            success: false,
            msg: "Error in removing Category. " + err.message,
            data: null,
        });
    }

});


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

        response.success = true;
        response.message = "SubCategory added successfully";
        response.data = newSubCategory;
        return res.status(200).json(response);
    } catch (err) {
        response.message = "Error in adding SubCategory. " + err.message;
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
        response.message = "Error in updating SubCategory. " + err.message;
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
        response.message = "Error in updating SubCategory. " + err.message;
        return res.status(400).json(response);
    }

})
const getSubCategorys = asyncHandler(async (req, res) => {
    let response = new Response();

    try {
        let SubCategorys = await SubCategory.find({ is_active: req.body.active }).populate("Category");

        response.success = true;
        response.data = SubCategorys;
        return res.status(200).json(response);
    }
    catch (err) {
        response.message = "Error in getting SubCategory. " + err.message;
        return res.status(400).json(response);
    }
})
const getSubCategoryById = asyncHandler(async (req, res) => {
    let response = new Response();

    try {
        let SubCategorys = await SubCategory.findOne({ is_active: true, _id: req.params.id });

        response.success = true;
        response.data = SubCategorys;
        return res.status(200).json(response);
    }
    catch (err) {
        response.message = "Error in getting SubCategory by id. " + err.message;
        return res.status(400).json(response);
    }
})
const deleteSubCategory = asyncHandler(async (req, res) => {
    try {
        await SubCategory.deleteOne({ _id: req.params.id }).lean().exec((err, doc) => {
            if (err) {
                return res.status(401).json({
                    success: false,
                    msg: err
                }).end();
            } else {
                return res.status(200).json({
                    success: true,
                    msg: "SubCategory removed. ",
                }).end();
            }
        });

    } catch (err) {
        return res.status(400).json({
            success: false,
            msg: "Error in removing SubCategory. " + err.message,
            data: null,
        });
    }

});


const addRole = asyncHandler(async (req, res) => {
    let response = new Response();

    try {
        let oldRole = await Role.findOne({ Name: req.body.name });

        if (oldRole) {
            response.message = "Role with same name already exist.";
            return res.status(400).json(response);
        }

        let newRole = await Role.create({
            Name: req.body.name,
            is_active: true,
        });
        if (newRole) {
            let resuser = await Module.find({ is_group: true });
            let insertdata = resuser.map(f => ({
                role: newRole._id,
                moduleId: f._id,
                read: true,
                write: true,
                delete: true
            }));
            if (insertdata.length > 0) {
                const savedNotification = await moduleRight.insertMany(insertdata);
            }
        }
        response.success = true;
        response.message = "Role added successfully";
        response.data = newRole;
        return res.status(200).json(response);
    } catch (err) {
        response.message = "Error in adding Role. " + err.message;
        return res.status(400).json(response);
    }

});
const editRole = asyncHandler(async (req, res) => {
    let response = new Response();

    try {
        let oldRole = Role.findById(req.body.id);

        if (!oldRole) {
            response.message = "Role not found.";
            return res.status(400).json(response);
        }

        let newRole = await Role.findByIdAndUpdate(req.body.id, {
            Name: req.body.name
        });

        response.success = true;
        response.message = "Role added successfully";
        response.data = newRole;
        return res.status(200).json(response);
    } catch (err) {
        response.message = "Error in updating Role. " + err.message;
        return res.status(400).json(response);
    }

});
const changeRoleStatus = asyncHandler(async (req, res) => {
    let response = new Response();

    try {
        let newRole = await Role.findByIdAndUpdate(req.body.id, {
            is_active: req.body.active
        });

        response.success = true;
        response.message = "Role status updated successfully";
        return res.status(200).json(response);
    }
    catch (err) {
        response.message = "Error in updating Role. " + err.message;
        return res.status(400).json(response);
    }

})
const getRoles = asyncHandler(async (req, res) => {
    let response = new Response();

    try {
        let Roles = await Role.find({ is_active: req.body.active });

        response.success = true;
        response.data = Roles;
        return res.status(200).json(response);
    }
    catch (err) {
        response.message = "Error in getting Role. " + err.message;
        return res.status(400).json(response);
    }
})
const getRoleById = asyncHandler(async (req, res) => {
    let response = new Response();

    try {
        let Roles = await Role.findOne({ is_active: true, _id: req.params.id });

        response.success = true;
        response.data = Roles;
        return res.status(200).json(response);
    }
    catch (err) {
        response.message = "Error in getting Role by id. " + err.message;
        return res.status(400).json(response);
    }
})
const deleteRole = asyncHandler(async (req, res) => {
    try {
        await Role.deleteOne({ _id: req.params.id }).lean().exec((err, doc) => {
            if (err) {
                return res.status(401).json({
                    success: false,
                    msg: err
                }).end();
            } else {
                return res.status(200).json({
                    success: true,
                    msg: "Role removed. ",
                }).end();
            }
        });

    } catch (err) {
        return res.status(400).json({
            success: false,
            msg: "Error in removing Role. " + err.message,
            data: null,
        });
    }

});


const addStatus = asyncHandler(async (req, res) => {
    let response = new Response();

    try {
        let oldStatus = await Status.findOne({ Name: req.body.name, GroupName: req.body.groupname });

        if (oldStatus) {
            response.message = "Status with same name already exist.";
            return res.status(400).json(response);
        }

        let newStatus = await Status.create({
            Name: req.body.name,
            GroupName: req.body.groupname,
            Role: req.body.role || null,
            Assign: req.body.assign || null,
            Color: req.body.color,
            is_active: true,
        });

        response.success = true;
        response.message = "Status added successfully";
        response.data = newStatus;
        return res.status(200).json(response);
    } catch (err) {
        response.message = "Error in adding Status. " + err.message;
        return res.status(400).json(response);
    }

});
const editStatus = asyncHandler(async (req, res) => {
    let response = new Response();

    try {
        let oldStatus = Status.findById(req.body.id);

        if (!oldStatus) {
            response.message = "Status not found.";
            return res.status(400).json(response);
        }

        let newStatus = await Status.findByIdAndUpdate(req.body.id, {
            Name: req.body.name,
            Role: req.body.role || null,
            Assign: req.body.assign || null,
            Color: req.body.color
        });

        response.success = true;
        response.message = "Status added successfully";
        response.data = newStatus;
        return res.status(200).json(response);
    } catch (err) {
        response.message = "Error in updating Status. " + err.message;
        return res.status(400).json(response);
    }

});
const changeStatus = asyncHandler(async (req, res) => {
    let response = new Response();

    try {
        let newStatus = await Status.findByIdAndUpdate(req.body.id, {
            is_active: req.body.active
        });

        response.success = true;
        response.message = "Status updated successfully";
        return res.status(200).json(response);
    }
    catch (err) {
        response.message = "Error in updating Status. " + err.message;
        return res.status(400).json(response);
    }

})
const getStatus = asyncHandler(async (req, res) => {
    let response = new Response();
    var condition = { is_active: req.body.active };
    if (req.body.GroupName) {
        condition.GroupName = req.body.GroupName
    }
    try {
        let Statuss = await Status.find(condition);

        response.success = true;
        response.data = Statuss;
        return res.status(200).json(response);
    }
    catch (err) {
        response.message = "Error in getting Status. " + err.message;
        return res.status(400).json(response);
    }
})
const getStatusById = asyncHandler(async (req, res) => {
    let response = new Response();

    try {
        let Statuss = await Status.findOne({ is_active: true, _id: req.params.id });

        response.success = true;
        response.data = Statuss;
        return res.status(200).json(response);
    }
    catch (err) {
        response.message = "Error in getting Status by id. " + err.message;
        return res.status(400).json(response);
    }
})
const deleteStatus = asyncHandler(async (req, res) => {
    try {
        await Status.deleteOne({ _id: req.params.id }).lean().exec((err, doc) => {
            if (err) {
                return res.status(401).json({
                    success: false,
                    msg: err
                }).end();
            } else {
                return res.status(200).json({
                    success: true,
                    msg: "Status removed. ",
                }).end();
            }
        });

    } catch (err) {
        return res.status(400).json({
            success: false,
            msg: "Error in removing Status. " + err.message,
            data: null,
        });
    }

});

const editConfigurationStatus = asyncHandler(async (req, res) => {
    let response = new Response();
    try {
        req.body.status.map(async (f) => {
            let status = await Status.findByIdAndUpdate(f._id, {
                Role: f.role || null,
                Assign: f.assign || null,
                Color: f.color
            });
        })
        response.success = true;
        response.message = `Status updated successfully`;
        response.data = "";

        return res.status(200).json(response);
    } catch (err) {
        response.message = "Error in updating Status. " + err.message;
        return res.status(400).json(response);
    }
});

const getApplicationSetting = asyncHandler(async (req, res) => {
    let response = new Response();

    try {
        let ApplicationSetting = ApplicationSettingTenant(req.conn);
        let applicationSetting = await ApplicationSetting.findOne();

        response.success = true;
        response.data = applicationSetting;
        return res.status(200).json(response);
    }
    catch (err) {
        response.message = "Error in getting Application Setting. " + err.message;
        return res.status(400).json(response);
    }
})

const addApplicationSetting = asyncHandler(async (req, res) => {
    try {
        process.env.UPLOADFILE = "";
        await uploadFile(req, res, function (err) {
            if (err) {
                return ("Error uploading file.");
            } else {
                editSave(req, res, process.env.UPLOADFILE)
            }
        })

    } catch (err) {
        return res.status(400).json({
            success: false,
            msg: "Error in editing data. " + err.message,
            data: null,
        });

    }
})

const editSave = asyncHandler(async (req, res, fileName) => {
    try {
        const { Id, CompanyTitle, CompanySubTitle, BankName, AccNo, IFSCNo, CompanyLogo, Quotation, QuotationPrefix, RegisterNo, PanNo, GSTNo, QuotationSuffix, Invoice, InvoicePrefix, InvoiceSuffix, Ticket, TicketPrefix, TicketSuffix, Customer, CustomerPrefix, CustomerSuffix, Order, OrderPrefix, OrderSuffix, TermsAndCondition, OfficeAddress, OfficeEmail, OfficePhone1, OfficePhone2,IndiaMartKey,JustDialKey } = req.body
        let ApplicationSetting = ApplicationSettingTenant(req.conn);
        let existNews = await ApplicationSetting.findById(Id);
        if (!existNews) {
            return res.status(400).json({
                success: false,
                msg: "Application Setting not found"
            });
        }

        fileName = fileName != "" ? fileName.replace(",", "") : existNews.CompanyLogo;

        let newApplicationSetting = await ApplicationSetting.findByIdAndUpdate(Id, {
            CompanyTitle,
            CompanySubTitle,
            BankName,
            AccNo,
            IFSCNo,
            CompanyLogo: fileName,
            Quotation,
            QuotationPrefix,
            QuotationSuffix,
            Invoice,
            InvoicePrefix,
            InvoiceSuffix,
            Ticket,
            TicketPrefix,
            TicketSuffix,
            Customer,
            CustomerPrefix,
            CustomerSuffix,
            Order,
            OrderPrefix,
            OrderSuffix,
            RegisterNo,
            PanNo,
            GSTNo,
            TermsAndCondition,
            OfficeAddress,
            OfficeEmail,
            OfficePhone1,
            OfficePhone2,
            IndiaMartKey,
            JustDialKey
        });
        return res.status(200).json({
            success: true,
            data: newApplicationSetting,
            msg: "Application Setting updated successfully"
        });
    } catch (err) {
        return res.status(400).json({
            success: false,
            msg: "Error in updating Application Setting. " + err.message
        });
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
                $match: {
                    is_group: false,
                },
            },
            {
                $group: {
                    _id: "$GroupName",
                    obj: {
                        $push: "$$ROOT",
                    },
                },
            },
        ]).sort("GroupName");
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

const addMailAddress = asyncHandler(async (req, res) => {
    let response = new Response();

    try {
        let oldMailAddress = await MailAddress.findOne({ Address: req.body.Address });

        if (oldMailAddress) {
            response.message = "MailAddress with same Address already exist.";
            return res.status(400).json(response);
        }
        let newMailAddress = await MailAddress.create({
            Name: req.body.Name,
            Address: req.body.Address,
            Password: req.body.Password,
            Server: req.body.Server,
            Port: req.body.Port,
            is_default: false,
            is_active: true,
        });

        response.success = true;
        response.message = "MailAddress added successfully";
        response.data = newMailAddress;
        return res.status(200).json(response);
    } catch (err) {
        response.message = "Error in adding MailAddress. " + err.message;
        return res.status(400).json(response);
    }

});

const editMailAddress = asyncHandler(async (req, res) => {
    let response = new Response();

    try {
        let oldMailAddress = MailAddress.findById(req.body.id);

        if (!oldMailAddress) {
            response.message = "MailAddress not found.";
            return res.status(400).json(response);
        }

        let newMailAddress = await MailAddress.findByIdAndUpdate(req.body.id, {
            Name: req.body.Name,
            Address: req.body.Address,
            Password: req.body.Password,
            Server: req.body.Server,
            Port: req.body.Port,
        });

        response.success = true;
        response.message = "MailAddress updated successfully";
        return res.status(200).json(response);
    } catch (err) {
        response.message = "Error in updating MailAddress. " + err.message;
        return res.status(400).json(response);
    }

});

const changeMailAddressStatus = asyncHandler(async (req, res) => {
    let response = new Response();

    try {
        let newMailAddress = await MailAddress.findByIdAndUpdate(req.body.id, {
            is_active: req.body.active
        });

        response.success = true;
        response.message = "MailAddress status updated successfully";
        return res.status(200).json(response);
    }
    catch (err) {
        response.message = "Error in updating status. " + err.message;
        return res.status(400).json(response);
    }

})

const getMailAddress = asyncHandler(async (req, res) => {
    let response = new Response();

    try {
        let MailAddresss = await MailAddress.find({ is_active: req.body.active }).sort({ createdAt: -1 });

        response.success = true;
        response.data = MailAddresss;
        return res.status(200).json(response);
    }
    catch (err) {
        response.message = "Error in getting MailAddress. " + err.message;
        return res.status(400).json(response);
    }
})

const getMailAddressById = asyncHandler(async (req, res) => {
    let response = new Response();

    try {
        let MailAddresss = await MailAddress.findOne({ is_active: true, _id: req.params.id });

        response.success = true;
        response.data = MailAddresss;
        return res.status(200).json(response);
    }
    catch (err) {
        response.message = "Error in getting MailAddress by id. " + err.message;
        return res.status(400).json(response);
    }
})

const setDefaultMailAddress = asyncHandler(async (req, res) => {
    try {
        await MailAddress.updateMany({
            is_default: false
        });
        await MailAddress.findByIdAndUpdate(req.body.addressId, {
            is_default: req.body.default
        });
        return res.status(200).json({
            success: true,
            msg: "Default Mail Address set"
        });
    } catch (err) {
        return res.status(400).json({
            success: false,
            msg: "Error in removing Mail Address. " + err.message,
            data: null,
        });
    }

});

module.exports = {
    getApplicationSetting,
    addApplicationSetting,
    addProduct,
    editProduct,
    changeProductStatus,
    getProduct,
    getProductById,
    deleteProduct,
    addType,
    editType,
    changeTypeStatus,
    getType,
    getTypeById,
    deleteType,
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
    getCountrys,
    getCountryById,
    changeCountryStatus,
    deleteCountry,
    addState,
    editState,
    getStates,
    getStateById,
    changeStateStatus,
    deleteState,
    addCity,
    editCity,
    getCitys,
    getCityById,
    changeCityStatus,
    deleteCity,
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
    setDefaultMailAddress
}