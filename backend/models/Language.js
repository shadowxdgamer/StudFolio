const mongoose = require('mongoose');

const LanguageSchema = new mongoose.Schema({
  profile: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Profile',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Please add a language name'],
    trim: true,
    maxlength: [50, 'Language name cannot be more than 50 characters']
  },
  proficiency: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced', 'fluent', 'native'],
    default: 'intermediate'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Language', LanguageSchema);