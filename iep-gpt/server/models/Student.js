const mongoose = require('mongoose');

const StudentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  age: {
    type: Number,
    required: true
  },
  grade: {
    type: String,
    required: true
  },
  needs: [{
    type: String,
    required: true
  }],
  strengths: [{
    type: String
  }],
  interests: [{
    type: String
  }],
  accommodations: [{
    type: String
  }],
  learningStyle: {
    visual: {
      type: Number,
      default: 0
    },
    auditory: {
      type: Number,
      default: 0
    },
    kinesthetic: {
      type: Number,
      default: 0
    },
    reading: {
      type: Number,
      default: 0
    }
  },
  culturalBackground: {
    language: {
      type: String
    },
    traditions: [{
      type: String
    }],
    values: [{
      type: String
    }]
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Student', StudentSchema);
