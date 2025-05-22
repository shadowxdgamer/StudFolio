const Education = require('../models/Education');
const Profile = require('../models/Profile');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const { validationResult } = require('express-validator');

/**
 * @desc    Add education to profile
 * @route   POST /api/v1/profile/education
 * @access  Private
 */
exports.addEducation = asyncHandler(async (req, res, next) => {
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

  // Create new education
  const newEducation = {
    profile: profile._id,
    ...req.body
  };

  const education = await Education.create(newEducation);

  res.status(201).json({
    success: true,
    data: education
  });
});

/**
 * @desc    Get all education items for a profile
 * @route   GET /api/v1/profile/education
 * @access  Private
 */
exports.getEducation = asyncHandler(async (req, res, next) => {
  // Get user profile
  const profile = await Profile.findOne({ user: req.user.id });

  if (!profile) {
    return next(new ErrorResponse('Profile not found', 404));
  }

  // Get all education for this profile
  const education = await Education.find({ profile: profile._id }).sort({ from: -1 });

  res.status(200).json({
    success: true,
    count: education.length,
    data: education
  });
});

/**
 * @desc    Update education
 * @route   PUT /api/v1/profile/education/:id
 * @access  Private
 */
exports.updateEducation = asyncHandler(async (req, res, next) => {
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

  // Find education by id
  let education = await Education.findById(req.params.id);

  if (!education) {
    return next(new ErrorResponse('Education not found', 404));
  }

  // Make sure user owns the education record
  if (education.profile.toString() !== profile._id.toString()) {
    return next(new ErrorResponse('Not authorized to update this education', 401));
  }

  // Update education
  education = await Education.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true, runValidators: true }
  );

  res.status(200).json({
    success: true,
    data: education
  });
});

/**
 * @desc    Delete education
 * @route   DELETE /api/v1/profile/education/:id
 * @access  Private
 */
exports.deleteEducation = asyncHandler(async (req, res, next) => {
  // Get user profile
  const profile = await Profile.findOne({ user: req.user.id });

  if (!profile) {
    return next(new ErrorResponse('Profile not found', 404));
  }

  // Find education by id
  const education = await Education.findById(req.params.id);

  if (!education) {
    return next(new ErrorResponse('Education not found', 404));
  }

  // Make sure user owns the education record
  if (education.profile.toString() !== profile._id.toString()) {
    return next(new ErrorResponse('Not authorized to delete this education', 401));
  }

  // Delete education
  await education.remove();

  res.status(200).json({
    success: true,
    data: {}
  });
});