const mongoose = require('mongoose');

const EducationSchema = new mongoose.Schema({
  profile: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Profile',
    required: true
  },
  school: {
    type: String,
    required: [true, 'Please add a school or institution name'],
    trim: true,
    maxlength: [100, 'School name cannot be more than 100 characters']
  },
  degree: {
    type: String,
    required: [true, 'Please add a degree or certificate'],
    trim: true,
    maxlength: [100, 'Degree cannot be more than 100 characters']
  },
  fieldOfStudy: {
    type: String,
    required: [true, 'Please add a field of study'],
    trim: true,
    maxlength: [100, 'Field of study cannot be more than 100 characters']
  },
  from: {
    type: Date,
    required: [true, 'Please add a start date']
  },
  to: {
    type: Date
  },
  current: {
    type: Boolean,
    default: false
  },
  description: {
    type: String,
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  location: {
    type: String,
    maxlength: [100, 'Location cannot be more than 100 characters']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Education', EducationSchema);