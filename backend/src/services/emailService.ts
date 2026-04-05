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
    meetingLink?: string;
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

const toReadableTime = (time: string) => {
    const [hours, minutes] = time.split(':').map(Number);
    const date = new Date();
    date.setHours(hours || 0, minutes || 0, 0, 0);
    return date.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: true });
};

const escapeHtml = (value: string) => value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');

export const sendInterviewScheduledEmail = async (payload: InterviewEmailPayload) => {
    const transporter = getTransporter();

    const interviewDateReadable = toReadableDate(payload.interviewDate);
    const startTimeReadable = toReadableTime(payload.startTime);
    const endTimeReadable = toReadableTime(payload.endTime);
    const candidateSubject = `Interview Scheduled: ${payload.title}`;
    const senderAddress = process.env.SMTP_FROM || process.env.SMTP_USER || payload.recruiterEmail;
    const senderName = payload.recruiterName || 'Recruiter';

    const candidateNameSafe = escapeHtml(payload.candidateName);
    const titleSafe = escapeHtml(payload.title);
    const jobTitleSafe = payload.jobTitle ? escapeHtml(payload.jobTitle) : '';
    const modeSafe = escapeHtml(payload.mode);
    const meetingLinkSafe = payload.meetingLink ? escapeHtml(payload.meetingLink) : '';
    const notesSafe = payload.notes ? escapeHtml(payload.notes) : '';
    const recruiterNameSafe = escapeHtml(payload.recruiterName);
    const recruiterEmailSafe = escapeHtml(payload.recruiterEmail);
    const interviewDateSafe = escapeHtml(interviewDateReadable);
    const startTimeSafe = escapeHtml(startTimeReadable);
    const endTimeSafe = escapeHtml(endTimeReadable);

    const text = [
        `Hi ${payload.candidateName},`,
        '',
        'Your interview has been scheduled.',
        `Title: ${payload.title}`,
        payload.jobTitle ? `Job: ${payload.jobTitle}` : null,
        `Date: ${interviewDateReadable}`,
        `Time: ${startTimeReadable} - ${endTimeReadable}`,
        `Mode: ${payload.mode}`,
        payload.meetingLink ? `Meeting Link: ${payload.meetingLink}` : null,
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
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #f2f6fb; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #f2f6fb; padding: 28px 14px;">
        <tr>
            <td align="center">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: 660px; background-color: #ffffff; border: 1px solid #dbe4f0; border-radius: 12px; overflow: hidden;">
                    <tr>
                        <td style="background: linear-gradient(120deg, #0f4c5c 0%, #1f6f8b 100%); padding: 28px 30px; color: #ffffff;">
                            <p style="margin: 0 0 8px; font-size: 12px; letter-spacing: 0.08em; text-transform: uppercase; opacity: 0.9;">Hirevia Interview Desk</p>
                            <h1 style="margin: 0; font-size: 26px; font-weight: 700; line-height: 1.25;">Interview Confirmed</h1>
                            <p style="margin: 10px 0 0; font-size: 15px; line-height: 1.6; opacity: 0.95;">Your interview schedule is now finalized. Please find all details below.</p>
                        </td>
                    </tr>

                    <tr>
                        <td style="padding: 30px; color: #1f2937;">
                            <p style="margin: 0 0 16px; font-size: 18px; font-weight: 600;">Hi ${candidateNameSafe},</p>
                            <p style="margin: 0 0 22px; font-size: 15px; line-height: 1.7; color: #4b5563;">
                                Thank you for your interest. We are pleased to invite you for the next round. Please keep this email for your reference.
                            </p>

                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border: 1px solid #e5edf6; border-radius: 10px; overflow: hidden; margin: 0 0 20px;">
                                <tr>
                                    <td style="padding: 14px 16px; width: 36%; background-color: #f8fbff; color: #374151; font-size: 14px; font-weight: 600; border-bottom: 1px solid #e5edf6;">Interview Title</td>
                                    <td style="padding: 14px 16px; color: #111827; font-size: 14px; border-bottom: 1px solid #e5edf6;">${titleSafe}</td>
                                </tr>
                                ${payload.jobTitle ? `<tr><td style="padding: 14px 16px; width: 36%; background-color: #f8fbff; color: #374151; font-size: 14px; font-weight: 600; border-bottom: 1px solid #e5edf6;">Job Role</td><td style="padding: 14px 16px; color: #111827; font-size: 14px; border-bottom: 1px solid #e5edf6;">${jobTitleSafe}</td></tr>` : ''}
                                <tr>
                                    <td style="padding: 14px 16px; width: 36%; background-color: #f8fbff; color: #374151; font-size: 14px; font-weight: 600; border-bottom: 1px solid #e5edf6;">Date</td>
                                    <td style="padding: 14px 16px; color: #111827; font-size: 14px; border-bottom: 1px solid #e5edf6;">${interviewDateSafe}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 14px 16px; width: 36%; background-color: #f8fbff; color: #374151; font-size: 14px; font-weight: 600; border-bottom: 1px solid #e5edf6;">Time</td>
                                    <td style="padding: 14px 16px; color: #111827; font-size: 14px; border-bottom: 1px solid #e5edf6;">${startTimeSafe} - ${endTimeSafe}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 14px 16px; width: 36%; background-color: #f8fbff; color: #374151; font-size: 14px; font-weight: 600; ${payload.notes || payload.meetingLink ? 'border-bottom: 1px solid #e5edf6;' : ''}">Interview Mode</td>
                                    <td style="padding: 14px 16px; color: #111827; font-size: 14px; ${payload.notes || payload.meetingLink ? 'border-bottom: 1px solid #e5edf6;' : ''}">${modeSafe}</td>
                                </tr>
                                ${payload.meetingLink ? `<tr><td style="padding: 14px 16px; width: 36%; background-color: #f8fbff; color: #374151; font-size: 14px; font-weight: 600; ${payload.notes ? 'border-bottom: 1px solid #e5edf6;' : ''}">Google Meet Link</td><td style="padding: 14px 16px; color: #111827; font-size: 14px; ${payload.notes ? 'border-bottom: 1px solid #e5edf6;' : ''}"><a href="${meetingLinkSafe}" target="_blank" rel="noopener noreferrer" style="color: #0f4c5c; word-break: break-all;">${meetingLinkSafe}</a></td></tr>` : ''}
                                ${payload.notes ? `<tr><td style="padding: 14px 16px; width: 36%; background-color: #f8fbff; color: #374151; font-size: 14px; font-weight: 600;">Notes</td><td style="padding: 14px 16px; color: #111827; font-size: 14px;">${notesSafe}</td></tr>` : ''}
                            </table>

                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #f8fbff; border: 1px dashed #bfd2ea; border-radius: 10px; margin: 0 0 20px;">
                                <tr>
                                    <td style="padding: 14px 16px; color: #334155; font-size: 14px; line-height: 1.6;">
                                        <strong style="color: #111827;">Recruiter Contact:</strong> ${recruiterNameSafe} (${recruiterEmailSafe})
                                    </td>
                                </tr>
                            </table>

                            <p style="margin: 0; color: #6b7280; font-size: 13px; line-height: 1.7;">
                                Please join on time and ensure your internet, audio and camera setup is ready before the interview starts.
                            </p>
                        </td>
                    </tr>

                    <tr>
                        <td style="padding: 20px 30px 28px; background-color: #f9fbff; border-top: 1px solid #e5edf6;">
                            <p style="margin: 0 0 4px; color: #111827; font-size: 14px; font-weight: 600;">Best regards,</p>
                            <p style="margin: 0; color: #4b5563; font-size: 14px;">${recruiterNameSafe}</p>
                            <p style="margin: 12px 0 0; color: #9ca3af; font-size: 12px; line-height: 1.5;">This is an interview scheduling email from Hirevia.</p>
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
        replyTo: payload.recruiterEmail,
        subject: candidateSubject,
        text,
        html
    });

    const recruiterSubject = `Interview Scheduled for ${payload.candidateName}: ${payload.title}`;
    const recruiterText = [
        `Hi ${payload.recruiterName},`,
        '',
        `Interview has been scheduled for candidate: ${payload.candidateName}.`,
        `Candidate Email: ${payload.candidateEmail}`,
        `Title: ${payload.title}`,
        payload.jobTitle ? `Job: ${payload.jobTitle}` : null,
        `Date: ${interviewDateReadable}`,
        `Time: ${startTimeReadable} - ${endTimeReadable}`,
        `Mode: ${payload.mode}`,
        payload.meetingLink ? `Meeting Link: ${payload.meetingLink}` : null,
        payload.notes ? `Notes: ${payload.notes}` : null,
        '',
        'This is a confirmation copy of the candidate interview schedule email.',
        '',
        'Regards,',
        'Hirevia'
    ]
        .filter(Boolean)
        .join('\n');

    const recruiterHtml = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin: 0; padding: 0; background-color: #f2f6fb; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #f2f6fb; padding: 28px 14px;">
        <tr>
            <td align="center">
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: 660px; background-color: #ffffff; border: 1px solid #dbe4f0; border-radius: 12px; overflow: hidden;">
                    <tr>
                        <td style="background: linear-gradient(120deg, #0f4c5c 0%, #1f6f8b 100%); padding: 28px 30px; color: #ffffff;">
                            <p style="margin: 0 0 8px; font-size: 12px; letter-spacing: 0.08em; text-transform: uppercase; opacity: 0.9;">Hirevia Interview Desk</p>
                            <h1 style="margin: 0; font-size: 24px; font-weight: 700; line-height: 1.25;">Interview Scheduled Confirmation</h1>
                            <p style="margin: 10px 0 0; font-size: 15px; line-height: 1.6; opacity: 0.95;">This is to inform you that an interview has been successfully scheduled.</p>
                        </td>
                    </tr>

                    <tr>
                        <td style="padding: 30px; color: #1f2937;">
                            <p style="margin: 0 0 16px; font-size: 18px; font-weight: 600;">Hi ${recruiterNameSafe},</p>

                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border: 1px solid #e5edf6; border-radius: 10px; overflow: hidden; margin: 0 0 20px;">
                                <tr>
                                    <td style="padding: 14px 16px; width: 36%; background-color: #f8fbff; color: #374151; font-size: 14px; font-weight: 600; border-bottom: 1px solid #e5edf6;">Candidate</td>
                                    <td style="padding: 14px 16px; color: #111827; font-size: 14px; border-bottom: 1px solid #e5edf6;">${candidateNameSafe} (${escapeHtml(payload.candidateEmail)})</td>
                                </tr>
                                <tr>
                                    <td style="padding: 14px 16px; width: 36%; background-color: #f8fbff; color: #374151; font-size: 14px; font-weight: 600; border-bottom: 1px solid #e5edf6;">Interview Title</td>
                                    <td style="padding: 14px 16px; color: #111827; font-size: 14px; border-bottom: 1px solid #e5edf6;">${titleSafe}</td>
                                </tr>
                                ${payload.jobTitle ? `<tr><td style="padding: 14px 16px; width: 36%; background-color: #f8fbff; color: #374151; font-size: 14px; font-weight: 600; border-bottom: 1px solid #e5edf6;">Job Role</td><td style="padding: 14px 16px; color: #111827; font-size: 14px; border-bottom: 1px solid #e5edf6;">${jobTitleSafe}</td></tr>` : ''}
                                <tr>
                                    <td style="padding: 14px 16px; width: 36%; background-color: #f8fbff; color: #374151; font-size: 14px; font-weight: 600; border-bottom: 1px solid #e5edf6;">Date</td>
                                    <td style="padding: 14px 16px; color: #111827; font-size: 14px; border-bottom: 1px solid #e5edf6;">${interviewDateSafe}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 14px 16px; width: 36%; background-color: #f8fbff; color: #374151; font-size: 14px; font-weight: 600; border-bottom: 1px solid #e5edf6;">Time</td>
                                    <td style="padding: 14px 16px; color: #111827; font-size: 14px; border-bottom: 1px solid #e5edf6;">${startTimeSafe} - ${endTimeSafe}</td>
                                </tr>
                                <tr>
                                    <td style="padding: 14px 16px; width: 36%; background-color: #f8fbff; color: #374151; font-size: 14px; font-weight: 600; ${payload.notes || payload.meetingLink ? 'border-bottom: 1px solid #e5edf6;' : ''}">Interview Mode</td>
                                    <td style="padding: 14px 16px; color: #111827; font-size: 14px; ${payload.notes || payload.meetingLink ? 'border-bottom: 1px solid #e5edf6;' : ''}">${modeSafe}</td>
                                </tr>
                                ${payload.meetingLink ? `<tr><td style="padding: 14px 16px; width: 36%; background-color: #f8fbff; color: #374151; font-size: 14px; font-weight: 600; ${payload.notes ? 'border-bottom: 1px solid #e5edf6;' : ''}">Google Meet Link</td><td style="padding: 14px 16px; color: #111827; font-size: 14px; ${payload.notes ? 'border-bottom: 1px solid #e5edf6;' : ''}"><a href="${meetingLinkSafe}" target="_blank" rel="noopener noreferrer" style="color: #0f4c5c; word-break: break-all;">${meetingLinkSafe}</a></td></tr>` : ''}
                                ${payload.notes ? `<tr><td style="padding: 14px 16px; width: 36%; background-color: #f8fbff; color: #374151; font-size: 14px; font-weight: 600;">Notes</td><td style="padding: 14px 16px; color: #111827; font-size: 14px;">${notesSafe}</td></tr>` : ''}
                            </table>

                            <p style="margin: 0; color: #6b7280; font-size: 13px; line-height: 1.7;">**Candidate already notified with same Meet link.**
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
        to: payload.recruiterEmail,
        replyTo: payload.recruiterEmail,
        subject: recruiterSubject,
        text: recruiterText,
        html: recruiterHtml
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
