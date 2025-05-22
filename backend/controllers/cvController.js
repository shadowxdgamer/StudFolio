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
exports.generateCV = asyncHandler(async (req, res, next) => {
    let browser = null;
    try {
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
        };

        // Debug log for troubleshooting
        console.log('Generating CV for:', {
            name: cvData.profile.name,
            educationCount: cvData.education.length,
            experienceCount: cvData.experience.length
        });

        // Read and compile template
        const templatePath = path.join(__dirname, '../templates/cv-classic.hbs');
        if (!fs.existsSync(templatePath)) {
            throw new Error('CV template not found');
        }
        const templateHtml = fs.readFileSync(templatePath, 'utf8');
        const template = handlebars.compile(templateHtml);
        const html = template(cvData);        console.log('Launching browser...');
        browser = await puppeteer.launch({
            headless: 'new',
            args: [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-dev-shm-usage',
                '--disable-gpu',
                '--window-size=1920,1080',
                '--font-render-hinting=medium',
                '--force-color-profile=srgb',
                '--disable-web-security',
                '--disable-features=IsolateOrigins,site-per-process'
            ],
            ignoreHTTPSErrors: true,
            defaultViewport: {
                width: 1920,
                height: 1080
            },
            timeout: 60000
        });

        console.log('Creating new page...');
        const page = await browser.newPage();
        
        // Set reasonable timeout values
        await page.setDefaultNavigationTimeout(60000);
        await page.setDefaultTimeout(60000);
        
        console.log('Setting page content...');
        // Set content with robust configuration
        await page.setContent(html, { 
            waitUntil: ['domcontentloaded', 'networkidle0'],
            timeout: 60000
        });        console.log('Generating PDF...');
        const pdfBuffer = await page.pdf({
            format: 'A4',
            printBackground: true,
            margin: {
                top: '20px',
                right: '20px',
                bottom: '20px',
                left: '20px'
            },
            timeout: 60000,
            preferCSSPageSize: true
        });

        console.log('Closing browser...');
        if (page) {
            await page.close().catch(e => console.error('Error closing page:', e));
        }
        if (browser) {
            await browser.close().catch(e => console.error('Error closing browser:', e));
        }
        browser = null;

        console.log('Sending response...');
        // Set response headers and send
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="${profile.user.name.replace(/\s+/g, '-').toLowerCase()}-cv.pdf"`);
        res.send(pdfBuffer);

    }    catch (error) {
        console.error('CV Generation Error:', {
            message: error.message,
            stack: error.stack,
            name: error.name
        });

        // Clean up in case of error
        if (browser) {
            try {
                const pages = await browser.pages();
                await Promise.all(pages.map(page => page.close().catch(e => console.error('Error closing page:', e))));
                await browser.close().catch(e => console.error('Error closing browser:', e));
            } catch (cleanupError) {
                console.error('Error during cleanup:', cleanupError);
            }
        }

        return next(new ErrorResponse('Could not generate CV. Please try again.', 500));
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