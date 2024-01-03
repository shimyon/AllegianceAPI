const mongoose = require('mongoose')
//mongoose.set('strictQuery', false)

const taskSchema = mongoose.Schema(
  {
    Name: {
      type: String,
    },
    Description: {
      type: String
    },
    Status: {
      type: String,
    },
    Assign: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
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

module.exports = mongoose.model('Task', taskSchema)