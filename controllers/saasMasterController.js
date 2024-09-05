const asyncHandler = require('express-async-handler')
const Master = require('../models/masterModel')
const SaasModal = require('../models/saasmasterModel');
const Product = SaasModal.ProductModal;
const Type = SaasModal.TypeModal;
const State = SaasModal.StateModal;
const Country = SaasModal.CountryModal;
const City = SaasModal.CityModal;
const Source = SaasModal.SourceModal;
const Unit = SaasModal.UnitModal;
const Icon = SaasModal.IconModal;
const Category = SaasModal.CategoryModal;
const SubCategory = SaasModal.SubCategoryModal;
const Module = SaasModal.ModuleModal;
const moduleRight = require('../models/moduleRightModel');
const Role = SaasModal.RoleModal;
const Status = SaasModal.StatusModal;
const MailAddress = SaasModal.MailAddressModal;
const ApplicationSetting = SaasModal.ApplicationSettingModal;
const uploadFile = require("../middleware/uploadFileMiddleware");

const Response = require('../models/responseModel')

const addProduct = asyncHandler(async (req, res) => {
    let response = new Response();

    try {
        let Products = Product(req.conn);
        let oldProduct = await Products.findOne({ Name: req.body.name, Type: req.body.type });

        if (oldProduct) {
            response.message = "Product with same name already exist.";
            return res.status(400).json(response);
        }
        let newProduct = await Products.create({
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
        let Products = Product(req.conn);
        let oldProduct = Products.findById(req.body.id);

        if (!oldProduct) {
            response.message = "Product not found.";
            return res.status(400).json(response);
        }

        let newProduct = await Products.findByIdAndUpdate(req.body.id, {
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
        let Products = Product(req.conn);
        let newProduct = await Products.findByIdAndUpdate(req.body.id, {
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
        let Products = Product(req.conn);
        let products = await Products.find({ is_active: req.body.active }).sort({ createdAt: -1 });

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
        let Products = Product(req.conn);
        let products = await Products.findOne({ is_active: true, _id: req.params.id });

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
        let Products = Product(req.conn);
        await Products.deleteOne({ _id: req.params.id }).lean().exec((err, doc) => {
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
        let Types = Type(req.conn);
        let oldType = await Types.findOne({ Name: req.body.name });

        if (oldType) {
            response.message = "Type with same name already exist.";
            return res.status(400).json(response);
        }
        let newType = await Types.create({
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
        let Types = Type(req.conn);

        let oldType = Types.findById(req.body.id);

        if (!oldType) {
            response.message = "Type not found.";
            return res.status(400).json(response);
        }

        let newType = await Types.findByIdAndUpdate(req.body.id, {
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
        let Types = Type(req.conn);

        let newType = await Types.findByIdAndUpdate(req.body.id, {
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
        let Types = Type(req.conn);

        let types = await Types.find({ is_active: req.body.active }).sort({ createdAt: -1 });

        response.success = true;
        response.data = types;
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
        let Types = Type(req.conn);

        let types = await Types.findOne({ is_active: true, _id: req.params.id });

        response.success = true;
        response.data = types;
        return res.status(200).json(response);
    }
    catch (err) {
        response.message = "Error in getting Type by id. " + err.message;
        return res.status(400).json(response);
    }
})
const deleteType = asyncHandler(async (req, res) => {
    try {
        let Types = Type(req.conn);

        await Types.deleteOne({ _id: req.params.id }).lean().exec((err, doc) => {
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
        let Sources = Source(req.conn);
        let oldSource = await Sources.findOne({ Name: req.body.name });

        if (oldSource) {
            response.message = "Source with same name already exist.";
            return res.status(400).json(response);
        }

        let newSource = await Sources.create({
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
        let Sources = Source(req.conn);

        let oldSource = Sources.findById(req.body.id);

        if (!oldSource) {
            response.message = "Source not found.";
            return res.status(400).json(response);
        }

        let newSource = await Sources.findByIdAndUpdate(req.body.id, {
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
        let Sources = Source(req.conn);

        let newSource = await Sources.findByIdAndUpdate(req.body.id, {
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
        let Sources = Source(req.conn);

        let sources = await Sources.find({ is_active: req.body.active });

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
        let Sources = Source(req.conn);

        let sources = await Sources.findOne({ is_active: true, _id: req.params.id });

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
        let Sources = Source(req.conn);

        await Sources.deleteOne({ _id: req.params.id }).lean().exec((err, doc) => {
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
        let Countrys = Country(req.conn);
        let oldCountry = await Countrys.findOne({ Name: req.body.name });

        if (oldCountry) {
            response.message = "Country with same name already exist.";
            return res.status(400).json(response);
        }

        let newCountry = await Countrys.create({
            Name: req.body.name,
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
        let Countrys = Country(req.conn);
        let oldCountry = Countrys.findById(req.body.id);

        if (!oldCountry) {
            response.message = "Country not found.";
            return res.status(400).json(response);
        }

        let newCountry = await Countrys.findByIdAndUpdate(req.body.id, {
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
        let Countrys = Country(req.conn);
        let AllCountrys = await Countrys.find({ is_active:req.body.active });

        response.success = true;
        response.data = AllCountrys;
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
        let Countrys = Country(req.conn);

        let AllCountrys = await Countrys.findOne({ is_active: true, _id: req.params.id });

        response.success = true;
        response.data = AllCountrys;
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
        let Countrys = Country(req.conn);

        let newCountry = await Countrys.findByIdAndUpdate(req.body.id, {
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
        let Countrys = Country(req.conn);
        let States = State(req.conn);

        let deleteStates = await States.find({ Country: req.params.id }).count();
        if (deleteStates != 0) {
            if (deleteStates) {
                return res.status(400).json({
                    success: false,
                    msg: "You cannot delete this record because it is already in use",
                    data: null,
                });
            }
        }
        else {
            await Countrys.deleteOne({ _id: req.params.id }).lean().exec((err, doc) => {
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
        let States = State(req.conn);
        let oldState = await States.findOne({ Name: req.body.name });

        if (oldState) {
            response.message = "State with same name already exist.";
            return res.status(400).json(response);
        }

        let newState = await States.create({
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
        let States = State(req.conn);

        let oldState = States.findById(req.body.id);

        if (!oldState) {
            response.message = "State not found.";
            return res.status(400).json(response);
        }

        let newState = await States.findByIdAndUpdate(req.body.id, {
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
        let Countrys = Country(req.conn);
        let States = State(req.conn);
        let AllStates = await States.find({ is_active: req.body.active }).populate("Country");

        response.success = true;
        response.data = AllStates;
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
        let States = State(req.conn);

        let OneStates = await States.findOne({ is_active: true, _id: req.params.id });

        response.success = true;
        response.data = OneStates;
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
        let States = State(req.conn);

        let newState = await States.findByIdAndUpdate(req.body.id, {
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
        let States = State(req.conn);
        let CityConn = City(req.conn);


        let Citys = await CityConn.find({ State: req.params.id }).count();
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
            await States.deleteOne({ _id: req.params.id }).lean().exec((err, doc) => {
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
        let Citys = City(req.conn);
        let oldCity = await Citys.findOne({ Name: req.body.name });

        if (oldCity) {
            response.message = "City with same name already exist.";
            return res.status(400).json(response);
        }

        let newCity = await Citys.create({
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
        let Citys = City(req.conn);

        let oldCity = Citys.findById(req.body.id);

        if (!oldCity) {
            response.message = "City not found.";
            return res.status(400).json(response);
        }

        let newCity = await Citys.findByIdAndUpdate(req.body.id, {
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
        let Citys = City(req.conn);
        let States = State(req.conn);

        let citys = await Citys.find({ is_active: req.body.active }).populate("State");

        response.success = true;
        response.data = citys;
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
        let Citys = City(req.conn);

        let citys = await Citys.findOne({ is_active: true, _id: req.params.id });

        response.success = true;
        response.data = citys;
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
        let Citys = City(req.conn);

        let newCity = await Citys.findByIdAndUpdate(req.body.id, {
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
        let Citys = City(req.conn);

        await Citys.deleteOne({ _id: req.params.id }).lean().exec((err, doc) => {
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
        let Units = Unit(req.conn);
        let oldUnit = await Units.findOne({ Name: req.body.name });

        if (oldUnit) {
            response.message = "Unit with same name already exist.";
            return res.status(400).json(response);
        }

        let newUnit = await Units.create({
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
        let Units = Unit(req.conn);
        let oldUnit = Units.findById(req.body.id);

        if (!oldUnit) {
            response.message = "Unit not found.";
            return res.status(400).json(response);
        }

        let newUnit = await Units.findByIdAndUpdate(req.body.id, {
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
        let Units = Unit(req.conn);
        let newUnit = await Units.findByIdAndUpdate(req.body.id, {
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
        let Units = Unit(req.conn);
        let units = await Units.find({ is_active: req.body.active });

        response.success = true;
        response.data = units;
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
        let Units = Unit(req.conn);

        let units = await Units.findOne({ is_active: true, _id: req.params.id });

        response.success = true;
        response.data = units;
        return res.status(200).json(response);
    }
    catch (err) {
        response.message = "Error in getting Unit by id. " + err.message;
        return res.status(400).json(response);
    }
})
const deleteUnit = asyncHandler(async (req, res) => {
    try {
        let Units = Unit(req.conn);
        await Units.deleteOne({ _id: req.params.id }).lean().exec((err, doc) => {
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
        let Icons = Icon(req.conn);

        let oldIcon = await Icons.findOne({ Name: req.body.name });

        if (oldIcon) {
            response.message = "Icon with same name already exist.";
            return res.status(400).json(response);
        }

        let newIcon = await Icons.create({
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
        let Icons = Icon(req.conn);

        let oldIcon = Icons.findById(req.body.id);

        if (!oldIcon) {
            response.message = "Icon not found.";
            return res.status(400).json(response);
        }

        let newIcon = await Icons.findByIdAndUpdate(req.body.id, {
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
        let Icons = Icon(req.conn);
        let newIcon = await Icons.findByIdAndUpdate(req.body.id, {
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
        let Icons = Icon(req.conn);

        let icons = await Icons.find({ is_active: req.body.active });

        response.success = true;
        response.data = icons;
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
        let Icons = Icon(req.conn);
        let icons = await Icons.findOne({ is_active: true, _id: req.params.id });

        response.success = true;
        response.data = icons;
        return res.status(200).json(response);
    }
    catch (err) {
        response.message = "Error in getting Icon by id. " + err.message;
        return res.status(400).json(response);
    }
})
const deleteIcon = asyncHandler(async (req, res) => {
    try {
        let Icons = Icon(req.conn);
        await Icons.deleteOne({ _id: req.params.id }).lean().exec((err, doc) => {
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
        let Categorys = Category(req.conn);
        let oldCategory = await Categorys.findOne({ Name: req.body.name });

        if (oldCategory) {
            response.message = "Category with same name already exist.";
            return res.status(400).json(response);
        }

        let newCategory = await Categorys.create({
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
        let Categorys = Category(req.conn);
        let oldCategory = Categorys.findById(req.body.id);

        if (!oldCategory) {
            response.message = "Category not found.";
            return res.status(400).json(response);
        }

        let newCategory = await Categorys.findByIdAndUpdate(req.body.id, {
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
        let Categorys = Category(req.conn);
        let newCategory = await Categorys.findByIdAndUpdate(req.body.id, {
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
        let Categorys = Category(req.conn);
        let categorys = await Categorys.find({ is_active: req.body.active });

        response.success = true;
        response.data = categorys;
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
        let Categorys = Category(req.conn);
        let categorys = await Categorys.findOne({ is_active: true, _id: req.params.id });

        response.success = true;
        response.data = categorys;
        return res.status(200).json(response);
    }
    catch (err) {
        response.message = "Error in getting Category by id. " + err.message;
        return res.status(400).json(response);
    }
})
const deleteCategory = asyncHandler(async (req, res) => {
    try {
        let Categorys = Category(req.conn);
        let SubCategorys = SubCategory(req.conn);

        let subCategorys = await SubCategorys.find({ Category: req.params.id }).count();
        if (subCategorys != 0) {
            if (subCategorys) {
                return res.status(400).json({
                    success: false,
                    msg: "You cannot delete this record because it is already in use",
                    data: null,
                });
            }
        }
        else {
        await Categorys.deleteOne({ _id: req.params.id }).lean().exec((err, doc) => {
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
        let SubCategorys = SubCategory(req.conn);

        let oldSubCategory = await SubCategorys.findOne({ Name: req.body.name, Category: req.body.category });

        if (oldSubCategory) {
            response.message = "SubCategory with same name already exist.";
            return res.status(400).json(response);
        }

        let newSubCategory = await SubCategorys.create({
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
        let SubCategorys = SubCategory(req.conn);

        let oldSubCategory = SubCategorys.findById(req.body.id);

        if (!oldSubCategory) {
            response.message = "SubCategory not found.";
            return res.status(400).json(response);
        }

        let newSubCategory = await SubCategorys.findByIdAndUpdate(req.body.id, {
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
        let SubCategorys = SubCategory(req.conn);

        let newSubCategory = await SubCategorys.findByIdAndUpdate(req.body.id, {
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
        let SubCategorys = SubCategory(req.conn);

        let subCategorys = await SubCategorys.find({ is_active: req.body.active }).populate("Category");

        response.success = true;
        response.data = subCategorys;
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
        let SubCategorys = SubCategory(req.conn);
        let subCategorys = await SubCategorys.findOne({ is_active: true, _id: req.params.id });

        response.success = true;
        response.data = subCategorys;
        return res.status(200).json(response);
    }
    catch (err) {
        response.message = "Error in getting SubCategory by id. " + err.message;
        return res.status(400).json(response);
    }
})
const deleteSubCategory = asyncHandler(async (req, res) => {
    try {
        let SubCategorys = SubCategory(req.conn);
        await SubCategorys.deleteOne({ _id: req.params.id }).lean().exec((err, doc) => {
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
        let Roles = Role(req.conn);
        let Modules = Module(req.conn);
        let moduleRights = moduleRight(req.conn);


        let oldRole = await Roles.findOne({ Name: req.body.name });

        if (oldRole) {
            response.message = "Role with same name already exist.";
            return res.status(400).json(response);
        }

        let newRole = await Roles.create({
            Name: req.body.name,
            is_active: true,
        });
        if (newRole) {
            let resuser = await Modules.find({ is_group: true });
            let insertdata = resuser.map(f => ({
                role: newRole._id,
                moduleId: f._id,
                read: true,
                write: true,
                delete: true
            }));
            if (insertdata.length > 0) {
                const savedNotification = await moduleRights.insertMany(insertdata);
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
        let Roles = Role(req.conn);
        let oldRole = Roles.findById(req.body.id);

        if (!oldRole) {
            response.message = "Role not found.";
            return res.status(400).json(response);
        }

        let newRole = await Roles.findByIdAndUpdate(req.body.id, {
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
        let Roles = Role(req.conn);
        let newRole = await Roles.findByIdAndUpdate(req.body.id, {
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
        let Roles = Role(req.conn);
        let roles = await Roles.find({ is_active: req.body.active });

        response.success = true;
        response.data = roles;
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
        let Roles = Role(req.conn);
        let roles = await Roles.findOne({ is_active: true, _id: req.params.id });

        response.success = true;
        response.data = roles;
        return res.status(200).json(response);
    }
    catch (err) {
        response.message = "Error in getting Role by id. " + err.message;
        return res.status(400).json(response);
    }
})
const deleteRole = asyncHandler(async (req, res) => {
    try {
        let Roles = Role(req.conn);
        await Roles.deleteOne({ _id: req.params.id }).lean().exec((err, doc) => {
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
        let Statuss = Status(req.conn);
        let oldStatus = await Statuss.findOne({ Name: req.body.name, GroupName: req.body.groupname });

        if (oldStatus) {
            response.message = "Status with same name already exist.";
            return res.status(400).json(response);
        }

        let newStatus = await Statuss.create({
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
        let Statuss = Status(req.conn);

        let oldStatus = Statuss.findById(req.body.id);

        if (!oldStatus) {
            response.message = "Status not found.";
            return res.status(400).json(response);
        }

        let newStatus = await Statuss.findByIdAndUpdate(req.body.id, {
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
        let Statuss = Status(req.conn);

        let newStatus = await Statuss.findByIdAndUpdate(req.body.id, {
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
        let Statuss = Status(req.conn);

        let statuss = await Statuss.find(condition);

        response.success = true;
        response.data = statuss;
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
        let Statuss = Status(req.conn);
        let statuss = await Statuss.findOne({ is_active: true, _id: req.params.id });

        response.success = true;
        response.data = statuss;
        return res.status(200).json(response);
    }
    catch (err) {
        response.message = "Error in getting Status by id. " + err.message;
        return res.status(400).json(response);
    }
})
const deleteStatus = asyncHandler(async (req, res) => {
    try {
        let Statuss = Status(req.conn);

        await Statuss.deleteOne({ _id: req.params.id }).lean().exec((err, doc) => {
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
        let Statuss = Status(req.conn);

        req.body.status.map(async (f) => {
            let status = await Statuss.findByIdAndUpdate(f._id, {
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
        let ApplicationSettings = ApplicationSetting(req.conn);

        let applicationSetting = await ApplicationSettings.findOne();

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
        let ApplicationSettings = ApplicationSetting(req.conn);

        const { Id, CompanyTitle, CompanySubTitle, BankName, AccNo, IFSCNo, CompanyLogo, Quotation, QuotationPrefix, RegisterNo, PanNo, GSTNo, QuotationSuffix, Invoice, InvoicePrefix, InvoiceSuffix, Ticket, TicketPrefix, TicketSuffix, Customer, CustomerPrefix, CustomerSuffix, Order, OrderPrefix, OrderSuffix, TermsAndCondition, OfficeAddress, OfficeEmail, OfficePhone1, OfficePhone2,IndiaMartKey,JustDialKey } = req.body

        let existNews = await ApplicationSettings.findById(Id);
        if (!existNews) {
            return res.status(400).json({
                success: false,
                msg: "Application Setting not found"
            });
        }

        fileName = fileName != "" ? fileName.replace(",", "") : existNews.CompanyLogo;

        let newApplicationSetting = await ApplicationSettings.findByIdAndUpdate(Id, {
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
        let Modules = Module(req.conn);
        let oldModule = await Modules.findOne({ Name: req.body.name, GroupName: req.body.groupname });

        if (oldModule) {
            response.message = "Module with same name already exist.";
            return res.status(400).json(response);
        }

        let newModule = await Modules.create({
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
        let Modules = Module(req.conn);

        let oldModule = Modules.findById(req.body.id);

        if (!oldModule) {
            response.message = "Module not found.";
            return res.status(400).json(response);
        }

        let newModule = await Modules.findByIdAndUpdate(req.body.id, {
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
        let Modules = Module(req.conn);

        let newModule = await Modules.findByIdAndUpdate(req.body.id, {
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
        let Modules = Module(req.conn);        
        let sources = await Modules.find({ is_active: req.body.active });

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
        let Modules = Module(req.conn);
        const sources = await Modules.aggregate([
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
        let Modules = Module(req.conn);
        let sources = await Modules.findOne({ is_active: true, _id: req.params.id });

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
        let MailAddresss = MailAddress(req.conn);

        let oldMailAddress = await MailAddresss.findOne({ Address: req.body.Address });

        if (oldMailAddress) {
            response.message = "MailAddress with same Address already exist.";
            return res.status(400).json(response);
        }
        let newMailAddress = await MailAddresss.create({
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
        let MailAddresss = MailAddress(req.conn);
        let oldMailAddress = MailAddresss.findById(req.body.id);

        if (!oldMailAddress) {
            response.message = "MailAddress not found.";
            return res.status(400).json(response);
        }

        let newMailAddress = await MailAddresss.findByIdAndUpdate(req.body.id, {
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
        let MailAddresss = MailAddress(req.conn);
        let newMailAddress = await MailAddresss.findByIdAndUpdate(req.body.id, {
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
        let MailAddresss = MailAddress(req.conn);
        let mailAddresss = await MailAddresss.find({ is_active: req.body.active }).sort({ createdAt: -1 });

        response.success = true;
        response.data = mailAddresss;
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
        let MailAddresss = MailAddress(req.conn);

        let mailAddresss = await MailAddresss.findOne({ is_active: true, _id: req.params.id });

        response.success = true;
        response.data = mailAddresss;
        return res.status(200).json(response);
    }
    catch (err) {
        response.message = "Error in getting MailAddress by id. " + err.message;
        return res.status(400).json(response);
    }
})

const setDefaultMailAddress = asyncHandler(async (req, res) => {
    try {
        let MailAddresss = MailAddress(req.conn);

        await MailAddresss.updateMany({
            is_default: false
        });
        await MailAddresss.findByIdAndUpdate(req.body.addressId, {
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
