const mongoose = require('mongoose')
const moduleRightSchema = mongoose.Schema(
  {
    role: {
      type: String,
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
  }
)

module.exports = mongoose.model('ModuleRight', moduleRightSchema)