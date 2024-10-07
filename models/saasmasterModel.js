const mongoose = require('mongoose')

const productSchema = mongoose.Schema(
    {
        Name: {
            type: String,
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
const countrySchema = mongoose.Schema(
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
const stateSchema = mongoose.Schema(
    {
        Name: {
            type: String
        },
        Country:
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Country'
        },
        is_active: {
            type: Boolean
        }
    },
    {
        timestamps: true,
    });
const citySchema = mongoose.Schema(
    {
        Name: {
            type: String
        },
        State:
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'States'
        }
        ,
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
        GroupName: {
            type: String
        },
        Role: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Role'
        },
        Assign: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        is_active: {
            type: Boolean
        },
        Color: {
            type: String
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
const iconSchema = mongoose.Schema(
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
const moduleRightSchema = mongoose.Schema(
    {
        role: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Role'
        },
        moduleId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Module_Master'
        },
        read: {
            type: Boolean,
            default: false
        },
        write: {
            type: Boolean,
            default: false
        },
        delete: {
            type: Boolean,
            default: false
        },
    },
    {
        timestamps: true,
    })
const ApplicationSettingSchema = mongoose.Schema(
    {
        CompanyTitle: {
            type: String
        },
        CompanySubTitle: {
            type: String
        },
        CompanyLogo: {
            type: String
        },
        Quotation: {
            type: Boolean,
            default: false
        },
        QuotationPrefix: {
            type: String
        },
        QuotationSuffix: {
            type: String
        },
        Invoice: {
            type: Boolean,
            default: false
        },
        InvoicePrefix: {
            type: String
        },
        InvoiceSuffix: {
            type: String
        },
        Ticket: {
            type: Boolean,
            default: false
        },
        TicketPrefix: {
            type: String
        },
        TicketSuffix: {
            type: String
        },
        Customer: {
            type: Boolean,
            default: false
        },
        CustomerPrefix: {
            type: String
        },
        CustomerSuffix: {
            type: String
        },
        Order: {
            type: Boolean,
            default: false
        },
        OrderPrefix: {
            type: String
        },
        OrderSuffix: {
            type: String
        },
        PanNo: {
            type: String
        },
        GSTNo: {
            type: String
        },
        RegisterNo: {
            type: String
        },
        BankName: {
            type: String
        },
        AccNo: {
            type: String
        },
        IFSCNo: {
            type: String
        },
        TermsAndCondition: {
            type: String
        },
        OfficeAddress: {
            type: String
        },
        OfficeEmail: {
            type: String
        },
        OfficePhone1: {
            type: String
        },
        OfficePhone2: {
            type: String
        },
        IndiaMartKey: {
            type: String
        },
        JustDialKey: {
            type: String
        }
    },
    {
        timestamps: true,
    });
module.exports = {
    ProductModal: (conn) => conn.model('Products', productSchema),
    TypeModal: (conn) => conn.model('Types', typeSchema),
    SourceModal: (conn) => conn.model('Sources', sourceSchema),
    CountryModal: (conn) => conn.model('Country', countrySchema),
    StateModal: (conn) => conn.model('States', stateSchema),
    CityModal: (conn) => conn.model('City', citySchema),
    UnitModal: (conn) => conn.model('Units', unitSchema),
    CategoryModal: (conn) => conn.model('Category', categorySchema),
    SubCategoryModal: (conn) => conn.model('SubCategory', subCategorySchema),
    IconModal: (conn) => conn.model('Icon', iconSchema),
    ModuleModal: (conn) => conn.model('Module_Master', ModuleSchema),
    RoleModal: (conn) => conn.model('Role', RoleSchema),
    StatusModal: (conn) => conn.model('Status', statusSchema),
    MailAddressModal: (conn) => conn.model('MailAddress', MailAddressSchema),
    ModuleRightModal: (conn) => conn.model('ModuleRights', moduleRightSchema),
    ApplicationSettingModal: (conn) => conn.model('ApplicationSetting', ApplicationSettingSchema)
}