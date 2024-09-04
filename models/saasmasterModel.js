const mongoose = require('mongoose')

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
module.exports = {
    TypeModal: (conn) => conn.model('Types', typeSchema),
    SourceModal: (conn) => conn.model('Sources', sourceSchema),
    CountryModal: (conn) => conn.model('Country', countrySchema),
    StateModal: (conn) => conn.model('States', stateSchema),
    CityModal: (conn) => conn.model('City', citySchema),
    UnitModal: (conn) => conn.model('Units', unitSchema),
    IconModal: (conn) => conn.model('Icon', iconSchema),
    ModuleModal: (conn) => conn.model('Module_Master', ModuleSchema),
    RoleModal: (conn) => conn.model('Role', RoleSchema),
    StatusModal: (conn) => conn.model('Status', statusSchema)
}