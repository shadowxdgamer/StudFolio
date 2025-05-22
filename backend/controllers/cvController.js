const Profile = require('../models/Profile');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');
const handlebars = require('../utils/handlebarsHelpers');

/**
 * @desc    Generate and download a CV as PDF
 * @route   GET /api/v1/cv/generate
 * @access  Private
 */
exports.generateCV = asyncHandler(async (req, res, next) => {    // Get user profile with all related data
    const profile = await Profile.findOne({ user: req.user.id })
        .populate({
            path: 'user',
            select: 'name email'
        })
        .populate({
            path: 'education',
            options: { sort: { from: -1 } }
        })
        .populate({
            path: 'experience',
            options: { sort: { from: -1 } }
        })
        .populate({
            path: 'projects',
            options: { sort: { createdAt: -1 } }
        })
        .populate('skills')
        .populate('languages');

    // Debug log
    console.log('Profile data:', {
        name: profile.user.name,
        educationCount: profile.education ? profile.education.length : 0,
        experienceCount: profile.experience ? profile.experience.length : 0,
        projectsCount: profile.projects ? profile.projects.length : 0,
        skillsCount: profile.skills ? profile.skills.length : 0,
        languagesCount: profile.languages ? profile.languages.length : 0
    });

    if (!profile) {
        return next(new ErrorResponse('Profile not found', 404));
    } try {
        // Convert Mongoose documents to plain objects
        const plainProfile = profile.toObject();

        // Prepare data for CV template
        const cvData = {
            profile: {
                name: plainProfile.user.name,
                headline: plainProfile.headline || '',
                email: plainProfile.user.email,
                phone: plainProfile.phone || '',
                location: plainProfile.location || '',
                website: plainProfile.website || '',
                bio: plainProfile.bio || '',
                social: plainProfile.social || {}
            },
            education: plainProfile.education ? plainProfile.education.map(edu => ({
                ...edu,
                from: new Date(edu.from),
                to: edu.to ? new Date(edu.to) : null
            })) : [],
            experience: plainProfile.experience ? plainProfile.experience.map(exp => ({
                ...exp,
                from: new Date(exp.from),
                to: exp.to ? new Date(exp.to) : null
            })) : [],
            projects: plainProfile.projects ? plainProfile.projects.map(proj => ({
                ...proj,
                from: proj.from ? new Date(proj.from) : null,
                to: proj.to ? new Date(proj.to) : null
            })) : [],
            skills: plainProfile.skills || [],
            languages: plainProfile.languages || [],
            themeColor: plainProfile.cvColor || '#4F46E5'
        };        // Debug log the CV data
        console.log('CV Data:', JSON.stringify({
            profileName: cvData.profile.name,
            educationCount: cvData.education.length,
            firstEducation: cvData.education[0],
            experienceCount: cvData.experience.length,
            firstExperience: cvData.experience[0],
            projectsCount: cvData.projects.length,
            firstProject: cvData.projects[0]
        }, null, 2));

        // Read the CV template (classic template)
        const templatePath = path.join(__dirname, '../templates/cv-classic.hbs');
        const templateHtml = fs.readFileSync(templatePath, 'utf8');
        const template = handlebars.compile(templateHtml);
        const html = template(cvData);

        // Launch puppeteer
        const browser = await puppeteer.launch({ headless: 'new' });
        const page = await browser.newPage();

        // Set content and wait until network is idle
        await page.setContent(html, { waitUntil: 'networkidle0' });

        // Generate PDF
        const pdfBuffer = await page.pdf({
            format: 'A4',
            printBackground: true,
            margin: {
                top: '20px',
                right: '20px',
                bottom: '20px',
                left: '20px'
            }
        });

        await browser.close();

        // Set response headers
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="${profile.user.name.replace(/\s+/g, '-').toLowerCase()}-cv.pdf"`);

        // Send PDF
        res.send(pdfBuffer);
    } catch (error) {
        console.error('CV Generation Error:', error);
        return next(new ErrorResponse('Could not generate CV', 500));
    }
});

/**
 * @desc    Get CV preview data
 * @route   GET /api/v1/cv/preview
 * @access  Private
 */
exports.getCVPreview = asyncHandler(async (req, res, next) => {
    // Get user profile with all related data
    const profile = await Profile.findOne({ user: req.user.id })
        .populate({
            path: 'user',
            select: 'name email'
        })
        .populate({
            path: 'education',
            options: { sort: { from: -1 } }
        })
        .populate({
            path: 'experience',
            options: { sort: { from: -1 } }
        })
        .populate({
            path: 'projects',
            options: { sort: { createdAt: -1 } }
        })
        .populate('skills')
        .populate('languages');

    if (!profile) {
        return next(new ErrorResponse('Profile not found', 404));
    }

    const cvData = {
        profile: {
            ...profile.toObject(),
            user: profile.user
        },
        education: profile.education || [],
        experience: profile.experience || [],
        projects: profile.projects || [],
        skills: profile.skills || [],
        languages: profile.languages || []
    };

    res.status(200).json({
        success: true,
        data: cvData
    });
});