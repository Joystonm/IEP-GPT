const mongoose = require('mongoose');

const LearningPlanSchema = new mongoose.Schema({
  studentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  goals: [{
    area: {
      type: String,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    strategies: [{
      type: String
    }],
    accommodations: [{
      type: String
    }],
    progress: {
      type: Number,
      default: 0
    }
  }],
  resources: [{
    title: {
      type: String
    },
    url: {
      type: String
    },
    description: {
      type: String
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('LearningPlan', LearningPlanSchema);
