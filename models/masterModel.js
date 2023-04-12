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

const ProductModal = mongoose.model('Products', productSchema);
const SourceModal = mongoose.model('Sources', sourceSchema);

const syncIndex = async () => {
    await ProductModal.syncIndexes();
    await SourceModal.syncIndexes();
}
syncIndex();

module.exports = { ProductModal, SourceModal };