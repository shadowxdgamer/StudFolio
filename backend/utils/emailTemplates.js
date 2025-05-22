const Handlebars = require("handlebars");

const baseTemplate = `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { 
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
        }
        .header {
            background: #4F46E5;
            color: white;
            padding: 20px;
            text-align: center;
            border-radius: 5px 5px 0 0;
        }
        .content {
            padding: 20px;
            background: #fff;
            border: 1px solid #ddd;
        }
        .footer {
            background: #f7f7f7;
            padding: 15px;
            text-align: center;
            font-size: 12px;
            border-radius: 0 0 5px 5px;
        }
        .button {
            display: inline-block;
            padding: 10px 20px;
            background: #4F46E5;
            color: white !important;
            text-decoration: none;
            border-radius: 5px;
            margin: 20px 0;
        }
            color: #166534;
        }
        .status.pending {
            background: #fef9c3;
            color: #854d0e;
        }
        .status.rejected {
            background: #fee2e2;
            color: #991b1b;
        }
    </style>
</head>
<body>
    <div class="header">
        <h2>{{siteName}}</h2>
    </div>
    <div class="content">
        {{{content}}}
    </div>
    <div class="footer">
        <p>© {{year}} {{siteName}}. All rights reserved.</p>
        <p>If you have any questions, please contact our support team.</p>
    </div>
</body>
</html>
`;

const templates = {
    verifyEmail: Handlebars.compile(`
        <h3>Welcome to StudFolio, {{firstName}}!</h3>
        <p>Thanks for signing up! Please verify your email address to get started.</p>
        <p>Click the button below to verify your email:</p>
        <a href="{{verificationUrl}}" class="button">Verify Email</a>
        <p>If you didn't create an account on StudFolio, you can safely ignore this email.</p>
        <p>This verification link will expire in 24 hours.</p>
    `),

    resetPassword: Handlebars.compile(`
        <h3>Password Reset Request</h3>
        <p>Hello {{firstName}},</p>
        <p>We received a request to reset your password. Click the button below to create a new password:</p>
        <a href="{{resetUrl}}" class="button">Reset Password</a>
        <p>If you didn't request a password reset, you can safely ignore this email.</p>
        <p>This password reset link will expire in 1 hour.</p>
    `),

    sellerApplicationSubmitted: Handlebars.compile(`
        <h3>Hello {{firstName}},</h3>
        <p>Thank you for applying to become a seller on {{siteName}}!</p>
        <div class="status pending">
            <strong>Application Status:</strong> Pending Review
        </div>
        <p>Your application details:</p>
        <ul>
            <li>Store Name: {{storeName}}</li>
            <li>Business Email: {{businessEmail}}</li>
            <li>Submission Date: {{submissionDate}}</li>
        </ul>
        <p>We'll review your application within 2-3 business days. You'll receive an email notification once the review is complete.</p>
        <a href="{{dashboardUrl}}" class="button">Check Application Status</a>
    `),

    sellerApplicationApproved: Handlebars.compile(`
        <h3>Congratulations {{firstName}}!</h3>
        <div class="status approved">
            <strong>Application Status:</strong> Approved
        </div>
        <p>Your application to become a seller on {{siteName}} has been approved!</p>
        <p>Your store "{{storeName}}" is now live and ready for business.</p>
        <h4>Next Steps:</h4>
        <ol>
            <li>Complete your store profile</li>
            <li>Add your products</li>
            <li>Set up payment information</li>
            <li>Start selling!</li>
        </ol>
        <a href="{{dashboardUrl}}" class="button">Go to Seller Dashboard</a>
    `),

    sellerApplicationRejected: Handlebars.compile(`
        <h3>Hello {{firstName}},</h3>
        <div class="status rejected">
            <strong>Application Status:</strong> Not Approved
        </div>
        <p>Thank you for your interest in becoming a seller on {{siteName}}.</p>
        <p>After careful review, we regret to inform you that your application could not be approved at this time.</p>
        {{#if notes}}
        <p><strong>Feedback:</strong> {{notes}}</p>
        {{/if}}
        <p>You can submit a new application after addressing the feedback provided.</p>
        <a href="{{supportUrl}}" class="button">Contact Support</a>
    `),
};

const renderEmail = (templateName, data) => {
    const contentTemplate = templates[templateName];
    if (!contentTemplate) {
        throw new Error(`Template ${templateName} not found`);
    }

    const content = contentTemplate({
        ...data,
        siteName: "StudFolio",
        year: new Date().getFullYear(),
        dashboardUrl: `${process.env.FRONTEND_URL}/dashboard`,
        supportUrl: `${process.env.FRONTEND_URL}/support`,
    });

    return Handlebars.compile(baseTemplate)({
        content,
        siteName: "StudFolio",
        year: new Date().getFullYear(),
    });
};

module.exports = { renderEmail };
