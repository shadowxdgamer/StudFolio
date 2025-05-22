const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  headline: {
    type: String,
    maxlength: [100, 'Headline cannot be more than 100 characters']
  },
  bio: {
    type: String,
    maxlength: [500, 'Bio cannot be more than 500 characters']
  },
  location: {
    type: String,
    maxlength: [100, 'Location cannot be more than 100 characters']
  },
  website: {
    type: String,
    match: [
      /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)/,
      'Please use a valid URL with HTTP or HTTPS'
    ]
  },
  social: {
    linkedin: {
      type: String,
      match: [
        /^(http(s)?:\/\/)?([\w]+\.)?linkedin\.com\/(pub|in|profile)/,
        'Please provide a valid LinkedIn URL'
      ]
    },
    github: {
      type: String,
      match: [
        /^(http(s)?:\/\/)?([\w]+\.)?github\.com\/[a-zA-Z0-9_-]+/,
        'Please provide a valid GitHub URL'
      ]
    },
    twitter: {
      type: String,
      match: [
        /^(http(s)?:\/\/)?([\w]+\.)?twitter\.com\/[a-zA-Z0-9_]+/,
        'Please provide a valid Twitter URL'
      ]
    },
    instagram: {
      type: String,
      match: [
        /^(http(s)?:\/\/)?([\w]+\.)?instagram\.com\/[a-zA-Z0-9_.]+/,
        'Please provide a valid Instagram URL'
      ]
    },
    behance: {
      type: String,
      match: [
        /^(http(s)?:\/\/)?([\w]+\.)?behance\.net\/[a-zA-Z0-9_-]+/,
        'Please provide a valid Behance URL'
      ]
    },
    dribbble: {
      type: String,
      match: [
        /^(http(s)?:\/\/)?([\w]+\.)?dribbble\.com\/[a-zA-Z0-9_-]+/,
        'Please provide a valid Dribbble URL'
      ]
    }
  },
  phone: {
    type: String,
    match: [
      /^\+?[\d\s()-]{7,20}$/,
      'Please provide a valid phone number'
    ]
  },
  avatar: {
    type: String,
    default: 'default-avatar.jpg'
  },
  cvColor: {
    type: String,
    default: '#4F46E5'
  },
  portfolioTheme: {
    type: String,
    enum: ['modern', 'classic', 'minimal', 'creative'],
    default: 'modern'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual populate
ProfileSchema.virtual('education', {
  ref: 'Education',
  localField: '_id',
  foreignField: 'profile',
  justOne: false
});

ProfileSchema.virtual('experience', {
  ref: 'Experience',
  localField: '_id',
  foreignField: 'profile',
  justOne: false
});

ProfileSchema.virtual('projects', {
  ref: 'Project',
  localField: '_id',
  foreignField: 'profile',
  justOne: false
});

ProfileSchema.virtual('skills', {
  ref: 'Skill',
  localField: '_id',
  foreignField: 'profile',
  justOne: false
});

ProfileSchema.virtual('languages', {
  ref: 'Language',
  localField: '_id',
  foreignField: 'profile',
  justOne: false
});

module.exports = mongoose.model('Profile', ProfileSchema);