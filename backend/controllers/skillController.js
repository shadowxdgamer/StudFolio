const Skill = require('../models/Skill');
const Profile = require('../models/Profile');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const { validationResult } = require('express-validator');

/**
 * @desc    Add skill to profile
 * @route   POST /api/v1/profile/skills
 * @access  Private
 */
exports.addSkill = asyncHandler(async (req, res, next) => {
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

    // Create new skill
    const newSkill = {
        profile: profile._id,
        ...req.body
    };

    const skill = await Skill.create(newSkill);

    res.status(201).json({
        success: true,
        data: skill
    });
});

/**
 * @desc    Get all skills for a profile
 * @route   GET /api/v1/profile/skills
 * @access  Private
 */
exports.getSkills = asyncHandler(async (req, res, next) => {
    // Get user profile
    const profile = await Profile.findOne({ user: req.user.id });

    if (!profile) {
        return next(new ErrorResponse('Profile not found', 404));
    }

    // Get all skills for this profile
    const skills = await Skill.find({ profile: profile._id });

    // Group skills by category
    const groupedSkills = skills.reduce((acc, skill) => {
        const category = skill.category;
        if (!acc[category]) {
            acc[category] = [];
        }
        acc[category].push(skill);
        return acc;
    }, {});

    res.status(200).json({
        success: true,
        count: skills.length,
        data: skills,
        groupedData: groupedSkills
    });
});

/**
 * @desc    Update skill
 * @route   PUT /api/v1/profile/skills/:id
 * @access  Private
 */
exports.updateSkill = asyncHandler(async (req, res, next) => {
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

    // Find skill by id
    let skill = await Skill.findById(req.params.id);

    if (!skill) {
        return next(new ErrorResponse('Skill not found', 404));
    }

    // Make sure user owns the skill record
    if (skill.profile.toString() !== profile._id.toString()) {
        return next(new ErrorResponse('Not authorized to update this skill', 401));
    }

    // Update skill
    skill = await Skill.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
    );

    res.status(200).json({
        success: true,
        data: skill
    });
});

/**
 * @desc    Delete skill
 * @route   DELETE /api/v1/profile/skills/:id
 * @access  Private
 */
exports.deleteSkill = asyncHandler(async (req, res, next) => {
    // Get user profile
    const profile = await Profile.findOne({ user: req.user.id });

    if (!profile) {
        return next(new ErrorResponse('Profile not found', 404));
    }

    // Find skill by id
    const skill = await Skill.findById(req.params.id);

    if (!skill) {
        return next(new ErrorResponse('Skill not found', 404));
    }

    // Make sure user owns the skill record
    if (skill.profile.toString() !== profile._id.toString()) {
        return next(new ErrorResponse('Not authorized to delete this skill', 401));
    }

    // Delete skill
    await skill.remove();

    res.status(200).json({
        success: true,
        data: {}
    });
});