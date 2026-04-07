const fs = require('fs');

let code = fs.readFileSync('src/services/emailService.ts', 'utf-8');

// replace types
code = code.replace("const sendViaGas = async (to, subject, html, senderName, replyTo) => {", 
"const sendViaGas = async (to: string, subject: string, html: string, senderName: string, replyTo?: string) => {");

// Manually replace transporter sending blocks
code = code.replace(/await transporter\.sendMail\([\s\S]*?\}\);/g, (match) => {
    if (match.includes("to: payload.candidateEmail") && match.includes("subject: candidateSubject")) {
        return "await sendViaGas(payload.candidateEmail, candidateSubject, html, senderName, payload.recruiterEmail);";
    }
    if (match.includes("to: payload.recruiterEmail")) {
        return "await sendViaGas(payload.recruiterEmail, recruiterSubject, recruiterHtml, senderName, payload.recruiterEmail);";
    }
    if (match.includes("to: payload.candidateEmail") && match.includes("subject,")) {
        return "await sendViaGas(payload.candidateEmail, subject, html, senderName);";
    }
    if (match.includes("to: email")) {
        return "await sendViaGas(email, subject, html, senderName);";
    }
    return match;
});

fs.writeFileSync('src/services/emailService.ts', code);
