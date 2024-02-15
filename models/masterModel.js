const mongoose = require('mongoose')

const productSchema = mongoose.Schema(
    {
        Name: {
            type: String,
            required: [true, 'Please add name']
        },
        Type: {
            type: String
        },
        Code: {
            type: String
        },
        Category: {
            type: String
        },
        SubCategory: {
            type: String
        },
        PurchasePrice: {
            type: Number
        },
        SalePrice: {
            type: Number
        },
        Tax: {
            type: Number
        },
        MinStock: {
            type: String
        },
        MaxStock: {
            type: String
        },
        AvailableStock: {
            type: String
        },
        Description: {
            type: String
        },
        is_active: {
            type: Boolean
        }
    },
    {
        timestamps: true,
    });

const stateSchema = mongoose.Schema(
    {
        Name: {
            type: String
        },
        is_active: {
            type: Boolean
        }
    },
    {
        timestamps: true,
    });
const sourceSchema = mongoose.Schema(
    {
        Name: {
            type: String
        },
        is_active: {
            type: Boolean
        }
    },
    {
        timestamps: true,
    });
const unitSchema = mongoose.Schema(
    {
        Name: {
            type: String
        },
        is_active: {
            type: Boolean
        }
    },
    {
        timestamps: true,
    });

const categorySchema = mongoose.Schema(
    {
        Name: {
            type: String
        },
        subCategory: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'SubCategory'
        }],
        is_active: {
            type: Boolean
        }
    },
    {
        timestamps: true,
    });

const subCategorySchema = mongoose.Schema(
    {
        Name: {
            type: String
        },
        Category:
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Category'
        }
        ,
        is_active: {
            type: Boolean
        }
    },
    {
        timestamps: true,
    });
const typeSchema = mongoose.Schema(
    {
        Name: {
            type: String,
            required: [true, 'Please add name']
        },
        is_active: {
            type: Boolean
        }
    },
    {
        timestamps: true,
    });
const ModuleSchema = mongoose.Schema(
    {
        Name: {
            type: String,
        },
        GroupName: {
            type: String
        },
        is_group: {
            type: Boolean,
            default: false,
        },
        is_active: {
            type: Boolean
        }
    },
    {
        timestamps: true,
    });
const RoleSchema = mongoose.Schema(
    {
        Name: {
            type: String
        },
        is_active: {
            type: Boolean
        }
    },
    {
        timestamps: true,
    });
const statusSchema = mongoose.Schema(
    {
        Name: {
            type: String
        },
        GroupName:
        {
            type: String
        },
        is_active: {
            type: Boolean
        }
    },
    {
        timestamps: true,
    });
const MailAddressSchema = mongoose.Schema(
    {
        Name: {
            type: String
        },
        Address:
        {
            type: String
        },
        Password:
        {
            type: String
        },
        Server:
        {
            type: String
        },
        Port:
        {
            type: String
        },
        is_default: {
            type: Boolean
        },
        is_active: {
            type: Boolean
        }
    },
    {
        timestamps: true,
    });
const ProductModal = mongoose.model('Products', productSchema);
const TypeModal = mongoose.model('Types', typeSchema);
const SourceModal = mongoose.model('Sources', sourceSchema);
const StateModal = mongoose.model('States', stateSchema);
const UnitModal = mongoose.model('Units', unitSchema);
const CategoryModal = mongoose.model('Category', categorySchema);
const SubCategoryModal = mongoose.model('SubCategory', subCategorySchema);
const ModuleModal = mongoose.model('Module_Master', ModuleSchema);
const RoleModal = mongoose.model('Role', RoleSchema);
const StatusModal = mongoose.model('Status', statusSchema);
const MailAddressModal = mongoose.model('MailAddress', MailAddressSchema);

const syncIndex = async () => {
    await ProductModal.syncIndexes();
    await TypeModal.syncIndexes();
    await SourceModal.syncIndexes();
    await StateModal.syncIndexes();
    await UnitModal.syncIndexes();
    await CategoryModal.syncIndexes();
    await SubCategoryModal.syncIndexes();
    await ModuleModal.syncIndexes();
    await RoleModal.syncIndexes();
    await StatusModal.syncIndexes();
    await MailAddressModal.syncIndexes();
}
syncIndex();

module.exports = { ProductModal, TypeModal, StateModal, SourceModal, UnitModal, CategoryModal, SubCategoryModal, ModuleModal, RoleModal, StatusModal, MailAddressModal };