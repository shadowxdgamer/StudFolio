const Profile = require('../models/Profile');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const puppeteer = require('puppeteer');
const path = require('path');
const fs = require('fs');
const handlebars = require('handlebars');

/**
 * @desc    Generate and download a CV as PDF
 * @route   GET /api/v1/cv/generate
 * @access  Private
 */
exports.generateCV = asyncHandler(async (req, res, next) => {
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
            match: { featured: true },
            options: { limit: 3 }
        })
        .populate('skills')
        .populate('languages');

    if (!profile) {
        return next(new ErrorResponse('Profile not found', 404));
    }

    try {
        // Prepare data for CV template
        const cvData = {
            profile: {
                name: profile.user.name,
                headline: profile.headline || '',
                email: profile.user.email,
                phone: profile.phone || '',
                location: profile.location || '',
                website: profile.website || '',
                bio: profile.bio || '',
                social: profile.social || {}
            },
            education: profile.education || [],
            experience: profile.experience || [],
            projects: profile.projects || [],
            skills: profile.skills || [],
            languages: profile.languages || [],
            themeColor: profile.cvColor || '#4F46E5'
        };

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