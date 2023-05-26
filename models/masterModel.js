const mongoose = require('mongoose')

const productSchema = mongoose.Schema(
    {
        Name: {
            type: String,
            required: [true, 'Please add name']
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

const sourceSchema = mongoose.Schema(
    {
        Name: {
            type: String
        },
        is_active: {
            type: Boolean
        }
    });

const unitSchema = mongoose.Schema(
    {
        Name: {
            type: String
        },
        is_active: {
            type: Boolean
        }
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
    });

const ProductModal = mongoose.model('Products', productSchema);
const SourceModal = mongoose.model('Sources', sourceSchema);
const UnitModal = mongoose.model('Units', unitSchema);
const CategoryModal = mongoose.model('Category', categorySchema);
const SubCategoryModal = mongoose.model('SubCategory', subCategorySchema);

const syncIndex = async () => {
    await ProductModal.syncIndexes();
    await SourceModal.syncIndexes();
    await UnitModal.syncIndexes();
    await CategoryModal.syncIndexes();
    await SubCategoryModal.syncIndexes();
}
syncIndex();

module.exports = { ProductModal, SourceModal, UnitModal, CategoryModal, SubCategoryModal };