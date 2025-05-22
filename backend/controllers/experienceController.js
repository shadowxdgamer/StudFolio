const Experience = require('../models/Experience');
const Profile = require('../models/Profile');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const { validationResult } = require('express-validator');

/**
 * @desc    Add experience to profile
 * @route   POST /api/v1/profile/experience
 * @access  Private
 */
exports.addExperience = asyncHandler(async (req, res, next) => {
  // Check validation results from express-validator
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }

  // Get user profile
  const profile = await Profile.findOne({ user: req.user.id });

  if (!profile) {
    return next(new ErrorResponse('Profile not found', 404));
  }

  // Create new experience
  const newExperience = {
    profile: profile._id,
    ...req.body
  };

  const experience = await Experience.create(newExperience);

  res.status(201).json({
    success: true,
    data: experience
  });
});

/**
 * @desc    Get all experience items for a profile
 * @route   GET /api/v1/profile/experience
 * @access  Private
 */
exports.getExperience = asyncHandler(async (req, res, next) => {
  // Get user profile
  const profile = await Profile.findOne({ user: req.user.id });

  if (!profile) {
    return next(new ErrorResponse('Profile not found', 404));
  }

  // Get all experience for this profile
  const experience = await Experience.find({ profile: profile._id }).sort({ from: -1 });

  res.status(200).json({
    success: true,
    count: experience.length,
    data: experience
  });
});

/**
 * @desc    Update experience
 * @route   PUT /api/v1/profile/experience/:id
 * @access  Private
 */
exports.updateExperience = asyncHandler(async (req, res, next) => {
  // Check validation results from express-validator
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }

  // Get user profile
  const profile = await Profile.findOne({ user: req.user.id });

  if (!profile) {
    return next(new ErrorResponse('Profile not found', 404));
  }

  // Find experience by id
  let experience = await Experience.findById(req.params.id);

  if (!experience) {
    return next(new ErrorResponse('Experience not found', 404));
  }

  // Make sure user owns the experience record
  if (experience.profile.toString() !== profile._id.toString()) {
    return next(new ErrorResponse('Not authorized to update this experience', 401));
  }

  // Update experience
  experience = await Experience.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  res.status(200).json({
    success: true,
    data: experience
  });
});

/**
 * @desc    Delete experience
 * @route   DELETE /api/v1/profile/experience/:id
 * @access  Private
 */
exports.deleteExperience = asyncHandler(async (req, res, next) => {
  // Get user profile
  const profile = await Profile.findOne({ user: req.user.id });

  if (!profile) {
    return next(new ErrorResponse('Profile not found', 404));
  }

  // Find experience by id
  const experience = await Experience.findById(req.params.id);

  if (!experience) {
    return next(new ErrorResponse('Experience not found', 404));
  }

  // Make sure user owns the experience record
  if (experience.profile.toString() !== profile._id.toString()) {
    return next(new ErrorResponse('Not authorized to delete this experience', 401));
  }

  // Delete experience
  await experience.remove();

  res.status(200).json({
    success: true,
    data: {}
  });
});