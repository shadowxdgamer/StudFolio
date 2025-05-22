const { check } = require('express-validator');

// Auth Validations
// Register validation
exports.registerValidation = [
    check('name', 'Name is required').notEmpty().trim().isLength({ min: 2 }),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password must be at least 8 characters')
        .isLength({ min: 8 })
        .matches(/\d/)
        .withMessage('Password must contain a number')
        .matches(/[A-Z]/)
        .withMessage('Password must contain an uppercase letter'),
    check('confirmPassword')
        .notEmpty()
        .withMessage('Confirm password is required')
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Passwords do not match');
            }
            return true;
        })
];

// Login validation
exports.loginValidation = [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').notEmpty()
];

// Forgot password validation
exports.forgotPasswordValidation = [
    check('email', 'Please include a valid email').isEmail()
];

// Reset password validation
exports.resetPasswordValidation = [
    check('password', 'Password must be at least 8 characters')
        .isLength({ min: 8 })
        .matches(/\d/)
        .withMessage('Password must contain a number')
        .matches(/[A-Z]/)
        .withMessage('Password must contain an uppercase letter'),
    check('confirmPassword')
        .notEmpty()
        .withMessage('Confirm password is required')
        .custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Passwords do not match');
            }
            return true;
        })
];

// Update password validation
exports.updatePasswordValidation = [
    check('currentPassword', 'Current password is required').notEmpty(),
    check('newPassword', 'New password must be at least 8 characters')
        .isLength({ min: 8 })
        .matches(/\d/)
        .withMessage('Password must contain a number')
        .matches(/[A-Z]/)
        .withMessage('Password must contain an uppercase letter'),
    check('confirmNewPassword')
        .notEmpty()
        .withMessage('Confirm password is required')
        .custom((value, { req }) => {
            if (value !== req.body.newPassword) {
                throw new Error('Passwords do not match');
            }
            return true;
        })
];

// Profile Validations
// Create/Update profile validation
exports.profileValidation = [
    check('headline').optional().trim().isLength({ max: 100 })
        .withMessage('Headline cannot be more than 100 characters'),
    check('bio').optional().trim().isLength({ max: 500 })
        .withMessage('Bio cannot be more than 500 characters'),
    check('location').optional().trim().isLength({ max: 100 })
        .withMessage('Location cannot be more than 100 characters'),
    check('website').optional().trim().isURL()
        .withMessage('Website must be a valid URL'),
    check('phone').optional().trim()
        .matches(/^\+?[\d\s()-]{7,20}$/)
        .withMessage('Please provide a valid phone number')
];

// Social links validation
exports.socialLinksValidation = [
    check('linkedin').optional().trim()
        .matches(/^(http(s)?:\/\/)?([\w]+\.)?linkedin\.com\/(pub|in|profile)/)
        .withMessage('Please provide a valid LinkedIn URL'),
    check('github').optional().trim()
        .matches(/^(http(s)?:\/\/)?([\w]+\.)?github\.com\/[a-zA-Z0-9_-]+/)
        .withMessage('Please provide a valid GitHub URL'),
    check('twitter').optional().trim()
        .matches(/^(http(s)?:\/\/)?([\w]+\.)?twitter\.com\/[a-zA-Z0-9_]+/)
        .withMessage('Please provide a valid Twitter URL'),
    check('instagram').optional().trim()
        .matches(/^(http(s)?:\/\/)?([\w]+\.)?instagram\.com\/[a-zA-Z0-9_.]+/)
        .withMessage('Please provide a valid Instagram URL'),
    check('behance').optional().trim()
        .matches(/^(http(s)?:\/\/)?([\w]+\.)?behance\.net\/[a-zA-Z0-9_-]+/)
        .withMessage('Please provide a valid Behance URL'),
    check('dribbble').optional().trim()
        .matches(/^(http(s)?:\/\/)?([\w]+\.)?dribbble\.com\/[a-zA-Z0-9_-]+/)
        .withMessage('Please provide a valid Dribbble URL')
];

// Education Validations
exports.educationValidation = [
    check('school', 'School or institution name is required')
        .notEmpty().trim().isLength({ max: 100 })
        .withMessage('School name cannot be more than 100 characters'),
    check('degree', 'Degree or certificate is required')
        .notEmpty().trim().isLength({ max: 100 })
        .withMessage('Degree cannot be more than 100 characters'),
    check('fieldOfStudy', 'Field of study is required')
        .notEmpty().trim().isLength({ max: 100 })
        .withMessage('Field of study cannot be more than 100 characters'),
    check('from', 'From date is required').notEmpty().isDate()
        .withMessage('From date must be a valid date'),
    check('to').optional().isDate()
        .withMessage('To date must be a valid date')
        .custom((value, { req }) => {
            if (value && req.body.from && new Date(value) < new Date(req.body.from)) {
                throw new Error('To date must be after from date');
            }
            return true;
        }),
    check('current').optional().isBoolean()
        .withMessage('Current must be a boolean'),
    check('description').optional().trim().isLength({ max: 500 })
        .withMessage('Description cannot be more than 500 characters'),
    check('location').optional().trim().isLength({ max: 100 })
        .withMessage('Location cannot be more than 100 characters')
];

// Experience Validations
exports.experienceValidation = [
    check('title', 'Job title is required')
        .notEmpty().trim().isLength({ max: 100 })
        .withMessage('Title cannot be more than 100 characters'),
    check('company', 'Company name is required')
        .notEmpty().trim().isLength({ max: 100 })
        .withMessage('Company cannot be more than 100 characters'),
    check('from', 'From date is required').notEmpty().isDate()
        .withMessage('From date must be a valid date'),
    check('to').optional().isDate()
        .withMessage('To date must be a valid date')
        .custom((value, { req }) => {
            if (value && req.body.from && new Date(value) < new Date(req.body.from)) {
                throw new Error('To date must be after from date');
            }
            return true;
        }),
    check('current').optional().isBoolean()
        .withMessage('Current must be a boolean'),
    check('description').optional().trim().isLength({ max: 500 })
        .withMessage('Description cannot be more than 500 characters'),
    check('location').optional().trim().isLength({ max: 100 })
        .withMessage('Location cannot be more than 100 characters'),
    check('type').optional().isIn(['full-time', 'part-time', 'internship', 'freelance', 'contract', 'volunteer'])
        .withMessage('Type must be one of: full-time, part-time, internship, freelance, contract, volunteer')
];

// Project Validations
exports.projectValidation = [
    check('title', 'Project title is required')
        .notEmpty().trim().isLength({ max: 100 })
        .withMessage('Title cannot be more than 100 characters'),
    check('description', 'Project description is required')
        .notEmpty().trim().isLength({ max: 500 })
        .withMessage('Description cannot be more than 500 characters'),
    check('technologies').optional().isArray()
        .withMessage('Technologies must be an array'),
    check('technologies.*').optional().isLength({ max: 50 })
        .withMessage('Technology name cannot be more than 50 characters'),
    check('liveUrl').optional().isURL()
        .withMessage('Live URL must be a valid URL'),
    check('githubUrl').optional().matches(/^(http(s)?:\/\/)?([\w]+\.)?github\.com\/[a-zA-Z0-9_-]+\/[a-zA-Z0-9_-]+/)
        .withMessage('Please provide a valid GitHub repository URL'),
    check('featured').optional().isBoolean()
        .withMessage('Featured must be a boolean'),
    check('from').optional().isDate()
        .withMessage('From date must be a valid date'),
    check('to').optional().isDate()
        .withMessage('To date must be a valid date')
        .custom((value, { req }) => {
            if (value && req.body.from && new Date(value) < new Date(req.body.from)) {
                throw new Error('To date must be after from date');
            }
            return true;
        })
];

// Skill Validations
exports.skillValidation = [
    check('name', 'Skill name is required')
        .notEmpty().trim().isLength({ max: 50 })
        .withMessage('Skill name cannot be more than 50 characters'),
    check('level').optional().isInt({ min: 1, max: 5 })
        .withMessage('Level must be a number between 1 and 5'),
    check('category').optional().isIn(['technical', 'soft', 'language', 'other'])
        .withMessage('Category must be one of: technical, soft, language, other')
];

// Language Validations
exports.languageValidation = [
    check('name', 'Language name is required')
        .notEmpty().trim().isLength({ max: 50 })
        .withMessage('Language name cannot be more than 50 characters'),
    check('proficiency').optional().isIn(['beginner', 'intermediate', 'advanced', 'fluent', 'native'])
        .withMessage('Proficiency must be one of: beginner, intermediate, advanced, fluent, native')
];

