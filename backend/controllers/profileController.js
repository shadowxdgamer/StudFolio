const Profile = require('../models/Profile');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const { validationResult } = require('express-validator');

/**
 * @desc    Create or update user profile
 * @route   POST /api/v1/profile
 * @access  Private
 */
exports.createProfile = asyncHandler(async (req, res, next) => {
  // Check validation results from express-validator
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }

  // Create profile object with user ID
  const profileFields = {
    user: req.user.id,
    ...req.body
  };

  // Check if profile already exists
  let profile = await Profile.findOne({ user: req.user.id });

  if (profile) {
    // Update existing profile
    profile = await Profile.findOneAndUpdate(
      { user: req.user.id },
      { $set: profileFields },
      { new: true, runValidators: true }
    );

    return res.status(200).json({
      success: true,
      data: profile
    });
  }

  // Create new profile
  profile = await Profile.create(profileFields);

  res.status(201).json({
    success: true,
    data: profile
  });
});

/**
 * @desc    Get current user profile
 * @route   GET /api/v1/profile/me
 * @access  Private
 */
exports.getMyProfile = asyncHandler(async (req, res, next) => {
  const profile = await Profile.findOne({ user: req.user.id })
    .populate({
      path: 'user',
      select: 'name email'
    })
    .populate('education')
    .populate('experience')
    .populate('projects')
    .populate('skills')
    .populate('languages');

  if (!profile) {
    return next(new ErrorResponse('Profile not found', 404));
  }

  res.status(200).json({
    success: true,
    data: profile
  });
});

/**
 * @desc    Get profile by user ID
 * @route   GET /api/v1/profile/user/:userId
 * @access  Public
 */
exports.getProfileByUserId = asyncHandler(async (req, res, next) => {
  const profile = await Profile.findOne({ user: req.params.userId })
    .populate({
      path: 'user',
      select: 'name email'
    })
    .populate('education')
    .populate('experience')
    .populate('projects')
    .populate('skills')
    .populate('languages');

  if (!profile) {
    return next(new ErrorResponse('Profile not found', 404));
  }

  res.status(200).json({
    success: true,
    data: profile
  });
});

/**
 * @desc    Get all profiles
 * @route   GET /api/v1/profile
 * @access  Public
 */
exports.getAllProfiles = asyncHandler(async (req, res, next) => {
  const profiles = await Profile.find()
    .populate({
      path: 'user',
      select: 'name email'
    })
    .select('-__v');

  res.status(200).json({
    success: true,
    count: profiles.length,
    data: profiles
  });
});

/**
 * @desc    Delete profile & user
 * @route   DELETE /api/v1/profile
 * @access  Private
 */
exports.deleteProfile = asyncHandler(async (req, res, next) => {
  // Find profile
  const profile = await Profile.findOne({ user: req.user.id });

  if (!profile) {
    return next(new ErrorResponse('Profile not found', 404));
  }

  // Remove profile
  await profile.remove();

  // Remove user (optional, depending on your requirements)
  // await User.findByIdAndRemove(req.user.id);

  res.status(200).json({
    success: true,
    data: {}
  });
});

/**
 * @desc    Update profile social links
 * @route   PUT /api/v1/profile/social
 * @access  Private
 */
exports.updateSocialLinks = asyncHandler(async (req, res, next) => {
  // Check validation results from express-validator
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }

  const { linkedin, github, twitter, instagram, behance, dribbble } = req.body;

  // Create social object
  const social = { linkedin, github, twitter, instagram, behance, dribbble };

  // Remove undefined values
  Object.keys(social).forEach(key => social[key] === undefined && delete social[key]);

  // Find and update profile
  const profile = await Profile.findOneAndUpdate(
    { user: req.user.id },
    { $set: { social } },
    { new: true, runValidators: true }
  );

  if (!profile) {
    return next(new ErrorResponse('Profile not found', 404));
  }

  res.status(200).json({
    success: true,
    data: profile
  });
});