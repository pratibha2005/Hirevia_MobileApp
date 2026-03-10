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
        ? `Application Shortlisted - ${payload.jobTitle}`
        : `Application Update - ${payload.jobTitle}`;

    const senderAddress = process.env.SMTP_FROM || process.env.SMTP_USER || 'no-reply@hirevia.com';
    const senderName = payload.companyName;

    // Plain text version
    let text = `Hi ${payload.candidateName},\n\n`;
    
    if (payload.status === 'Shortlisted') {
        text += `Congratulations! Your application for the ${payload.jobTitle} position at ${payload.companyName} has been shortlisted.\n\nOur team will be in touch with you shortly with the next steps.\n\nBest regards,\nThe ${payload.companyName} Team`;
    } else {
        text += `Thank you for your interest in the ${payload.jobTitle} position at ${payload.companyName}.\n\nWhile your background is impressive, we have decided to move forward with other candidates at this time.\n\nWe appreciate you taking the time to apply and wish you the best in your job search.\n\nBest regards,\nThe ${payload.companyName} Team`;
    }

    // Premium HTML version
    const html = payload.status === 'Shortlisted' ? `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #fafafa; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #fafafa; padding: 50px 20px;">
        <tr>
            <td align="center">
                <table width="640" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 2px; overflow: hidden; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);">
                    
                    <!-- Brand Header -->
                    <tr>
                        <td style="padding: 48px 50px 36px; border-bottom: 1px solid #e5e7eb;">
                            <h2 style="margin: 0; color: #0F4C5C; font-size: 14px; font-weight: 600; letter-spacing: 0.05em; text-transform: uppercase;">${payload.companyName}</h2>
                        </td>
                    </tr>
                    
                    <!-- Main Content -->
                    <tr>
                        <td style="padding: 50px 50px 40px;">
                            <h1 style="margin: 0 0 24px; color: #111827; font-size: 28px; font-weight: 600; line-height: 1.3; letter-spacing: -0.02em;">Congratulations, ${payload.candidateName}</h1>
                            
                            <p style="margin: 0 0 20px; color: #4b5563; font-size: 16px; line-height: 1.6;">
                                We are pleased to inform you that your application for the position of <strong style="color: #111827;">${payload.jobTitle}</strong> has been shortlisted for further consideration.
                            </p>
                            
                            <p style="margin: 0 0 36px; color: #4b5563; font-size: 16px; line-height: 1.6;">
                                Our recruitment team will be in contact with you shortly to discuss the next steps in the selection process.
                            </p>
                            
                            <!-- Details Section -->
                            <table width="100%" cellpadding="0" cellspacing="0" style="border: 1px solid #e5e7eb; border-radius: 2px; margin: 0 0 36px;">
                                <tr>
                                    <td style="padding: 24px 28px;">
                                        <table width="100%" cellpadding="0" cellspacing="0">
                                            <tr>
                                                <td style="padding: 8px 0; color: #6b7280; font-size: 14px; width: 140px;">Position</td>
                                                <td style="padding: 8px 0; color: #111827; font-size: 14px; font-weight: 500;">${payload.jobTitle}</td>
                                            </tr>
                                            <tr>
                                                <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Company</td>
                                                <td style="padding: 8px 0; color: #111827; font-size: 14px; font-weight: 500;">${payload.companyName}</td>
                                            </tr>
                                            <tr>
                                                <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Application Status</td>
                                                <td style="padding: 8px 0; color: #10b981; font-size: 14px; font-weight: 600;">Shortlisted</td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                            
                            <p style="margin: 0; color: #6b7280; font-size: 14px; line-height: 1.6;">
                                Please ensure your contact information is up to date and monitor your inbox for further communication from our team.
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="padding: 36px 50px 48px; background-color: #fafafa; border-top: 1px solid #e5e7eb;">
                            <p style="margin: 0 0 4px; color: #111827; font-size: 14px; font-weight: 500;">Best regards,</p>
                            <p style="margin: 0 0 28px; color: #6b7280; font-size: 14px;">Recruitment Team, ${payload.companyName}</p>
                            
                            <p style="margin: 0; color: #9ca3af; font-size: 12px; line-height: 1.5;">
                                This is an automated notification from ${payload.companyName}'s recruitment system powered by Hirevia. Please do not reply to this email.
                            </p>
                        </td>
                    </tr>
                    
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
    ` : `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #fafafa; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #fafafa; padding: 50px 20px;">
        <tr>
            <td align="center">
                <table width="640" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 2px; overflow: hidden; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);">
                    
                    <!-- Brand Header -->
                    <tr>
                        <td style="padding: 48px 50px 36px; border-bottom: 1px solid #e5e7eb;">
                            <h2 style="margin: 0; color: #0F4C5C; font-size: 14px; font-weight: 600; letter-spacing: 0.05em; text-transform: uppercase;">${payload.companyName}</h2>
                        </td>
                    </tr>
                    
                    <!-- Main Content -->
                    <tr>
                        <td style="padding: 50px 50px 40px;">
                            <h1 style="margin: 0 0 24px; color: #111827; font-size: 28px; font-weight: 600; line-height: 1.3; letter-spacing: -0.02em;">Application Status Update</h1>
                            
                            <p style="margin: 0 0 20px; color: #4b5563; font-size: 16px; line-height: 1.6;">
                                Dear ${payload.candidateName},
                            </p>
                            
                            <p style="margin: 0 0 20px; color: #4b5563; font-size: 16px; line-height: 1.6;">
                                Thank you for taking the time to apply for the <strong style="color: #111827;">${payload.jobTitle}</strong> position at ${payload.companyName}. We sincerely appreciate your interest in our organization.
                            </p>
                            
                            <p style="margin: 0 0 36px; color: #4b5563; font-size: 16px; line-height: 1.6;">
                                After careful consideration of all applications, we regret to inform you that we will not be moving forward with your candidacy at this time. This decision was challenging given the high caliber of applicants.
                            </p>
                            
                            <!-- Details Section -->
                            <table width="100%" cellpadding="0" cellspacing="0" style="border: 1px solid #e5e7eb; border-radius: 2px; margin: 0 0 36px;">
                                <tr>
                                    <td style="padding: 24px 28px;">
                                        <table width="100%" cellpadding="0" cellspacing="0">
                                            <tr>
                                                <td style="padding: 8px 0; color: #6b7280; font-size: 14px; width: 140px;">Position</td>
                                                <td style="padding: 8px 0; color: #111827; font-size: 14px; font-weight: 500;">${payload.jobTitle}</td>
                                            </tr>
                                            <tr>
                                                <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Company</td>
                                                <td style="padding: 8px 0; color: #111827; font-size: 14px; font-weight: 500;">${payload.companyName}</td>
                                            </tr>
                                            <tr>
                                                <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Application Status</td>
                                                <td style="padding: 8px 0; color: #6b7280; font-size: 14px; font-weight: 600;">Not Selected</td>
                                            </tr>
                                        </table>
                                    </td>
                                </tr>
                            </table>
                            
                            <p style="margin: 0 0 20px; color: #4b5563; font-size: 16px; line-height: 1.6;">
                                We encourage you to continue pursuing your career goals and wish you success in your professional endeavors. We will retain your information and may contact you should a suitable opportunity arise in the future.
                            </p>
                            
                            <p style="margin: 0; color: #6b7280; font-size: 14px; line-height: 1.6;">
                                Thank you once again for your interest in ${payload.companyName}.
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="padding: 36px 50px 48px; background-color: #fafafa; border-top: 1px solid #e5e7eb;">
                            <p style="margin: 0 0 4px; color: #111827; font-size: 14px; font-weight: 500;">Best regards,</p>
                            <p style="margin: 0 0 28px; color: #6b7280; font-size: 14px;">Recruitment Team, ${payload.companyName}</p>
                            
                            <p style="margin: 0; color: #9ca3af; font-size: 12px; line-height: 1.5;">
                                This is an automated notification from ${payload.companyName}'s recruitment system powered by Hirevia. Please do not reply to this email.
                            </p>
                        </td>
                    </tr>
                    
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
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

    const subject = 'Hirevia - Your Verification Code';
    const senderAddress = process.env.SMTP_FROM || process.env.SMTP_USER || 'no-reply@hirevia.com';
    const senderName = 'Hirevia';

    const text = `Your verification code is: ${otp}\n\nThis code will expire in 10 minutes.\n\nIf you didn't request this code, please ignore this email.\n\nBest regards,\nThe Hirevia Team`;
    
    const html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #fafafa; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #fafafa; padding: 50px 20px;">
        <tr>
            <td align="center">
                <table width="640" cellpadding="0" cellspacing="0" style="background-color: #ffffff; border-radius: 2px; overflow: hidden; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);">
                    
                    <!-- Brand Header -->
                    <tr>
                        <td style="padding: 48px 50px 36px; border-bottom: 1px solid #e5e7eb;">
                            <h2 style="margin: 0; color: #0F4C5C; font-size: 14px; font-weight: 600; letter-spacing: 0.05em; text-transform: uppercase;">Hirevia</h2>
                        </td>
                    </tr>
                    
                    <!-- Main Content -->
                    <tr>
                        <td style="padding: 50px 50px 40px;">
                            <h1 style="margin: 0 0 24px; color: #111827; font-size: 28px; font-weight: 600; line-height: 1.3; letter-spacing: -0.02em;">Email Verification</h1>
                            
                            <p style="margin: 0 0 36px; color: #4b5563; font-size: 16px; line-height: 1.6;">
                                Please use the following verification code to complete your registration. This code will expire in 10 minutes.
                            </p>
                            
                            <!-- OTP Display -->
                            <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #fafafa; border: 1px solid #e5e7eb; border-radius: 2px; margin: 0 0 36px;">
                                <tr>
                                    <td align="center" style="padding: 40px 28px;">
                                        <p style="margin: 0 0 12px; color: #6b7280; font-size: 12px; font-weight: 600; letter-spacing: 0.1em; text-transform: uppercase;">Verification Code</p>
                                        <p style="margin: 0; color: #111827; font-size: 40px; font-weight: 600; letter-spacing: 0.15em; font-family: 'SF Mono', 'Monaco', 'Inconsolata', 'Fira Code', 'Droid Sans Mono', 'Source Code Pro', monospace;">${otp}</p>
                                    </td>
                                </tr>
                            </table>
                            
                            <p style="margin: 0 0 24px; color: #6b7280; font-size: 14px; line-height: 1.6;">
                                If you did not request this verification code, please disregard this message. No further action is required.
                            </p>
                            
                            <p style="margin: 0; color: #9ca3af; font-size: 13px; line-height: 1.6;">
                                For security reasons, never share this code with anyone. Our team will never ask for your verification code.
                            </p>
                        </td>
                    </tr>
                    
                    <!-- Footer -->
                    <tr>
                        <td style="padding: 36px 50px 48px; background-color: #fafafa; border-top: 1px solid #e5e7eb;">
                            <p style="margin: 0 0 4px; color: #111827; font-size: 14px; font-weight: 500;">Best regards,</p>
                            <p style="margin: 0 0 28px; color: #6b7280; font-size: 14px;">The Hirevia Team</p>
                            
                            <p style="margin: 0; color: #9ca3af; font-size: 12px; line-height: 1.5;">
                                This is an automated message from Hirevia. Please do not reply to this email. © ${new Date().getFullYear()} Hirevia. All rights reserved.
                            </p>
                        </td>
                    </tr>
                    
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
    `;

    await transporter.sendMail({
        from: `${senderName} <${senderAddress}>`,
        to: email,
        subject,
        text,
        html
    });
};
