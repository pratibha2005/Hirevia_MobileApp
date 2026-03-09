import nodemailer from 'nodemailer';

type InterviewEmailPayload = {
    recruiterName: string;
    recruiterEmail: string;
    candidateName: string;
    candidateEmail: string;
    title: string;
    jobTitle?: string;
    interviewDate: string;
    startTime: string;
    endTime: string;
    mode: string;
    notes?: string;
};

export type ApplicationStatusEmailPayload = {
    candidateName: string;
    candidateEmail: string;
    companyName: string;
    jobTitle: string;
    status: 'Shortlisted' | 'Rejected';
};

const getTransporter = () => {
    const smtpHost = process.env.SMTP_HOST;
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const smtpPort = Number(process.env.SMTP_PORT || 587);

    if (!smtpHost || !smtpUser || !smtpPass) {
        throw new Error('SMTP is not configured. Please set SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS in backend/.env');
    }

    return nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: process.env.SMTP_SECURE === 'true' || smtpPort === 465,
        auth: {
            user: smtpUser,
            pass: smtpPass
        }
    });
};

const toReadableDate = (isoDate: string) => {
    const [year, month, day] = isoDate.split('-').map(Number);
    const date = new Date(year, (month || 1) - 1, day || 1);
    return date.toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'long' });
};

export const sendInterviewScheduledEmail = async (payload: InterviewEmailPayload) => {
    const transporter = getTransporter();

    const interviewDateReadable = toReadableDate(payload.interviewDate);
    const subject = `Interview Scheduled: ${payload.title}`;
    const senderAddress = process.env.SMTP_FROM || process.env.SMTP_USER || payload.recruiterEmail;
    const senderName = payload.recruiterName || 'Recruiter';

    const text = [
        `Hi ${payload.candidateName},`,
        '',
        'Your interview has been scheduled.',
        `Title: ${payload.title}`,
        payload.jobTitle ? `Job: ${payload.jobTitle}` : null,
        `Date: ${interviewDateReadable}`,
        `Time: ${payload.startTime} - ${payload.endTime}`,
        `Mode: ${payload.mode}`,
        payload.notes ? `Notes: ${payload.notes}` : null,
        '',
        `Recruiter: ${payload.recruiterName}`,
        `Recruiter Email: ${payload.recruiterEmail}`,
        '',
        'Best regards,',
        payload.recruiterName
    ]
        .filter(Boolean)
        .join('\n');

    const html = `
        <div style="font-family: Arial, sans-serif; color: #111827; line-height: 1.6;">
            <p>Hi ${payload.candidateName},</p>
            <p>Your interview has been scheduled.</p>
            <table style="border-collapse: collapse; width: 100%; max-width: 560px;">
                <tbody>
                    <tr><td style="padding: 6px 0; font-weight: 600;">Title</td><td style="padding: 6px 0;">${payload.title}</td></tr>
                    ${payload.jobTitle ? `<tr><td style="padding: 6px 0; font-weight: 600;">Job</td><td style="padding: 6px 0;">${payload.jobTitle}</td></tr>` : ''}
                    <tr><td style="padding: 6px 0; font-weight: 600;">Date</td><td style="padding: 6px 0;">${interviewDateReadable}</td></tr>
                    <tr><td style="padding: 6px 0; font-weight: 600;">Time</td><td style="padding: 6px 0;">${payload.startTime} - ${payload.endTime}</td></tr>
                    <tr><td style="padding: 6px 0; font-weight: 600;">Mode</td><td style="padding: 6px 0;">${payload.mode}</td></tr>
                    ${payload.notes ? `<tr><td style="padding: 6px 0; font-weight: 600;">Notes</td><td style="padding: 6px 0;">${payload.notes}</td></tr>` : ''}
                </tbody>
            </table>
            <p style="margin-top: 16px;">Recruiter: ${payload.recruiterName} (${payload.recruiterEmail})</p>
            <p>Best regards,<br />${payload.recruiterName}</p>
        </div>
    `;

    await transporter.sendMail({
        from: `${senderName} <${senderAddress}>`,
        to: payload.candidateEmail,
        replyTo: payload.recruiterEmail,
        subject,
        text,
        html
    });
};

export const sendApplicationStatusEmail = async (payload: ApplicationStatusEmailPayload) => {
    const transporter = getTransporter();

    const subject = payload.status === 'Shortlisted'
        ? `Update on your application at ${payload.companyName}`
        : `Update on your application at ${payload.companyName}`;

    const senderAddress = process.env.SMTP_FROM || process.env.SMTP_USER || 'no-reply@hirevia.com';
    const senderName = payload.companyName;

    let text = `Hi ${payload.candidateName},\n\n`;
    let html = `
        <div style="font-family: Arial, sans-serif; color: #111827; line-height: 1.6;">
            <p>Hi ${payload.candidateName},</p>
    `;

    if (payload.status === 'Shortlisted') {
        text += `Congratulations! Your application for the ${payload.jobTitle} position at ${payload.companyName} has been shortlisted.\n\nOur team will be in touch with you shortly with the next steps.`;
        html += `
            <p>Congratulations! Your application for the <strong>${payload.jobTitle}</strong> position at <strong>${payload.companyName}</strong> has been shortlisted.</p>
            <p>Our team will be in touch with you shortly with the next steps.</p>
        `;
    } else {
        text += `Thank you for your interest in the ${payload.jobTitle} position at ${payload.companyName}.\n\nWhile your background is impressive, we have decided to move forward with other candidates at this time.\n\nWe appreciate you taking the time to apply and wish you the best in your job search.`;
        html += `
            <p>Thank you for your interest in the <strong>${payload.jobTitle}</strong> position at <strong>${payload.companyName}</strong>.</p>
            <p>While your background is impressive, we have decided to move forward with other candidates at this time.</p>
            <p>We appreciate you taking the time to apply and wish you the best in your job search.</p>
        `;
    }

    text += `\n\nBest regards,\nThe ${payload.companyName} Team`;
    html += `
            <p>Best regards,<br />The ${payload.companyName} Team</p>
        </div>
    `;

    await transporter.sendMail({
        from: `${senderName} <${senderAddress}>`,
        to: payload.candidateEmail,
        subject,
        text,
        html
    });
};

export const sendOtpEmail = async (email: string, otp: string) => {
    const transporter = getTransporter();

    const subject = 'Hirevia - Email Verification OTP';
    const senderAddress = process.env.SMTP_FROM || process.env.SMTP_USER || 'no-reply@hirevia.com';
    const senderName = 'Hirevia';

    const text = `Your verification code is: ${otp}\n\nThis code will expire in 10 minutes.`;
    const html = `
        <div style="font-family: Arial, sans-serif; color: #111827; line-height: 1.6;">
            <h2>Email Verification</h2>
            <p>Your verification code is:</p>
            <h1 style="letter-spacing: 5px; color: #0F4C5C;">${otp}</h1>
            <p>This code will expire in 10 minutes.</p>
        </div>
    `;

    await transporter.sendMail({
        from: `${senderName} <${senderAddress}>`,
        to: email,
        subject,
        text,
        html
    });
};
