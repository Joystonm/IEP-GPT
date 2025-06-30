const mongoose = require('mongoose');

const ConsultationSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student'
  },
  expertId: {
    type: String,
    required: true
  },
  expertName: {
    type: String,
    required: true
  },
  expertPhoto: {
    type: String
  },
  type: {
    type: String,
    enum: ['plan-review', 'specific-question', 'strategy-development', 'progress-review'],
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'completed'],
    default: 'pending'
  },
  urgency: {
    type: String,
    enum: ['normal', 'urgent', 'immediate'],
    default: 'normal'
  },
  specificQuestions: {
    type: String
  },
  summary: {
    type: String
  },
  feedback: {
    type: String
  },
  attachments: [{
    type: String
  }],
  requestDate: {
    type: Date,
    default: Date.now
  },
  completedDate: {
    type: Date
  }
});

module.exports = mongoose.model('Consultation', ConsultationSchema);
