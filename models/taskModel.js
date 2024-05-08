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
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Status'
    },
    Assign: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    Reporter: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }],
    Priority: {
      type: String
    },
    StartDate: {
      type: Date,
    },
    EndDate: {
      type: Date,
    },
    addedBy: {
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