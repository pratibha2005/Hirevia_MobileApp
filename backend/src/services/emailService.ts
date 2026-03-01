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
