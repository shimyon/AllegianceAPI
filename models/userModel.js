const mongoose = require('mongoose')

collection = mongoose.Schema(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
      unique: true,
    },
    password: {
      type: String,
    },
    role: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Role',
    },
    is_active: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true,
  }
)

module.exports = (conn) => conn.model("User", collection);