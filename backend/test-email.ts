import dotenv from 'dotenv';
dotenv.config();
import nodemailer from 'nodemailer';

const smtpHost = process.env.SMTP_HOST;
const smtpUser = process.env.SMTP_USER;
const smtpPass = process.env.SMTP_PASS;
const smtpPort = Number(process.env.SMTP_PORT || 587);

console.log('Testing SMTP with:', { smtpHost, smtpPort, smtpUser, passLength: smtpPass?.length });

const transporter = nodemailer.createTransport({
    host: smtpHost,
    port: smtpPort,
    secure: process.env.SMTP_SECURE === 'true' || smtpPort === 465,
    auth: {
        user: smtpUser,
        pass: smtpPass
    }
});

transporter.sendMail({
    from: `"Test" <${smtpUser}>`,
    to: smtpUser,
    subject: 'Test Email',
    text: 'If you see this, SMTP is working.'
}, (err, info) => {
    if (err) {
        console.error('FAILED TO SEND EMAIL:', err);
    } else {
        console.log('EMAIL SENT SUCCESSFULLY:', info);
    }
});
