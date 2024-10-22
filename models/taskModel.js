const mongoose = require('mongoose');
//mongoose.set('strictQuery', false)

const taskSchema = mongoose.Schema(
  {
    Name: {
      type: String,
    },
    Description: {
      type: String
    },
    Reason: {
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
    LastComment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'TaskComment',
      default: null
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
    },
    image: {
      type: String
    },
    LeadId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Leads'
    },
    ProspectId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Prospect'
    },
    ProcessId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ContractProcess'
    },
    SubProcessId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ContractSubProcess'
    }
  },
  {
    timestamps: true,
  }
);
const taskCommentadd = mongoose.Schema(
  {
    TaskComment: {
      type: String,
    },
    taskId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Task'
    },
    addedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
  },
  {
    timestamps: true,
  }
)
module.exports = {
  TaskModal: (conn) => conn.model('Task', taskSchema),
  TaskCommentModal: (conn) => conn.model('TaskComment', taskCommentadd),
}
