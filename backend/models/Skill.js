const mongoose = require('mongoose');

const SkillSchema = new mongoose.Schema({
  profile: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Profile',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Please add a skill name'],
    trim: true,
    maxlength: [50, 'Skill name cannot be more than 50 characters']
  },
  level: {
    type: Number,
    min: [1, 'Level must be at least 1'],
    max: [5, 'Level cannot be more than 5'],
    default: 3
  },
  category: {
    type: String,
    enum: ['technical', 'soft', 'language', 'other'],
    default: 'technical'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Skill', SkillSchema);