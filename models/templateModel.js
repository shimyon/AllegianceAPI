const mongoose = require('mongoose')
const templateSchema = mongoose.Schema(
  {
    TemplateFor: {
      type: String,
    },
    Name: {
      type: String,
    },
    Detail: {
      type: String,
    },
    is_default: {
      type: Boolean,
      default: false
    },
    is_active: {
      type: Boolean,
      default: true
    },
  },
  {
    timestamps: true,
  }
)

// module.exports = mongoose.model('Template', templateSchema)
module.exports = (conn) => conn.model('Template', templateSchema);