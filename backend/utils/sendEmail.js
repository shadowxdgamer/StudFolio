const nodemailer = require("nodemailer");
const { renderEmail } = require("./emailTemplates");

const sendEmail = async (options) => {
    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT,
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });

    const html = renderEmail(options.template, options.data);

    const message = {
        from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
        to: options.email,
        subject: options.subject,
        html,
    };

    await transporter.sendMail(message);
};

module.exports = sendEmail;
