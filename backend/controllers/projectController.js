const Project = require('../models/Project');
const Profile = require('../models/Profile');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const { validationResult } = require('express-validator');

/**
 * @desc    Add project to profile
 * @route   POST /api/v1/profile/projects
 * @access  Private
 */
exports.addProject = asyncHandler(async (req, res, next) => {
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

    // Create new project
    const newProject = {
        profile: profile._id,
        ...req.body
    };

    const project = await Project.create(newProject);

    res.status(201).json({
        success: true,
        data: project
    });
});

/**
 * @desc    Get all projects for a profile
 * @route   GET /api/v1/profile/projects
 * @access  Private
 */
exports.getProjects = asyncHandler(async (req, res, next) => {
    // Get user profile
    const profile = await Profile.findOne({ user: req.user.id });

    if (!profile) {
        return next(new ErrorResponse('Profile not found', 404));
    }

    // Get all projects for this profile
    const projects = await Project.find({ profile: profile._id });

    res.status(200).json({
        success: true,
        count: projects.length,
        data: projects
    });
});

/**
 * @desc    Get featured projects for a profile
 * @route   GET /api/v1/profile/projects/featured
 * @access  Private
 */
exports.getFeaturedProjects = asyncHandler(async (req, res, next) => {
    // Get user profile
    const profile = await Profile.findOne({ user: req.user.id });

    if (!profile) {
        return next(new ErrorResponse('Profile not found', 404));
    }

    // Get featured projects for this profile
    const projects = await Project.find({
        profile: profile._id,
        featured: true
    });

    res.status(200).json({
        success: true,
        count: projects.length,
        data: projects
    });
});

/**
 * @desc    Update project
 * @route   PUT /api/v1/profile/projects/:id
 * @access  Private
 */
exports.updateProject = asyncHandler(async (req, res, next) => {
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

    // Find project by id
    let project = await Project.findById(req.params.id);

    if (!project) {
        return next(new ErrorResponse('Project not found', 404));
    }

    // Make sure user owns the project record
    if (project.profile.toString() !== profile._id.toString()) {
        return next(new ErrorResponse('Not authorized to update this project', 401));
    }

    // Update project
    project = await Project.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
    );

    res.status(200).json({
        success: true,
        data: project
    });
});

/**
 * @desc    Delete project
 * @route   DELETE /api/v1/profile/projects/:id
 * @access  Private
 */
exports.deleteProject = asyncHandler(async (req, res, next) => {
    // Get user profile
    const profile = await Profile.findOne({ user: req.user.id });

    if (!profile) {
        return next(new ErrorResponse('Profile not found', 404));
    }

    // Find project by id
    const project = await Project.findById(req.params.id);

    if (!project) {
        return next(new ErrorResponse('Project not found', 404));
    }

    // Make sure user owns the project record
    if (project.profile.toString() !== profile._id.toString()) {
        return next(new ErrorResponse('Not authorized to delete this project', 401));
    }

    // Delete project
    await project.remove();

    res.status(200).json({
        success: true,
        data: {}
    });
});