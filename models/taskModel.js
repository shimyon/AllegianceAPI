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
const TaskModal = mongoose.model('Task', taskSchema);
const TaskCommentModal = mongoose.model('TaskComment', taskCommentadd);
const syncIndex = async () => {
  await TaskModal.syncIndexes();
  await TaskCommentModal.syncIndexes();
}
syncIndex();
module.exports = { TaskModal, TaskCommentModal } ;