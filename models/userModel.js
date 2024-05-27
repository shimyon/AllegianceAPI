const mongoose = require('mongoose')
collection = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true,
    },
    password: {
      type: String,
      required: [true, 'Please add a password'],
    },
    role: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Role',
      // required: [true, 'Please add a role'],
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