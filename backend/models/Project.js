const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  profile: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Profile',
    required: true
  },
  title: {
    type: String,
    required: [true, 'Please add a project title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please add a description'],
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  technologies: [{
    type: String,
    trim: true,
    maxlength: [50, 'Technology name cannot be more than 50 characters']
  }],
  image: {
    url: {
      type: String
    },
    public_id: {
      type: String
    }
  },
  liveUrl: {
    type: String,
    match: [
      /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
      'Please use a valid URL with HTTP or HTTPS'
    ]
  },
  githubUrl: {
    type: String,
    match: [
      /^(http(s)?:\/\/)?([\w]+\.)?github\.com\/[a-zA-Z0-9_-]+\/[a-zA-Z0-9_-]+/,
      'Please provide a valid GitHub repository URL'
    ]
  },
  featured: {
    type: Boolean,
    default: false
  },
  from: {
    type: Date
  },
  to: {
    type: Date
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Project', ProjectSchema);