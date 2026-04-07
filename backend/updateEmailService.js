const fs = require('fs');
let code = fs.readFileSync('src/services/emailService.ts', 'utf-8');

code = code.replace("import nodemailer from 'nodemailer';", "import { Resend } from 'resend';");

const transporterRegex = /const getTransporter = \(\) => \{[\s\S]*?return nodemailer\.createTransport\(\{[\s\S]*?\}\);\n\};/;
code = code.replace(transporterRegex, "const getResendClient = () => {\n  if (!process.env.RESEND_API_KEY) {\n    throw new Error('RESEND_API_KEY is not configured in backend/.env');\n  }\n  return new Resend(process.env.RESEND_API_KEY);\n};");

code = code.replace(/const transporter = getTransporter\(\);/g, "const resend = getResendClient();");

// Replace await transporter.sendMail({ ... }) with await resend.emails.send({ ... }) 
// and map replyTo to reply_to if it exists.
code = code.replace(/await transporter\.sendMail\(\{([\s\S]*?)\}\);/g, (match, contents) => {
  let mappedContents = contents.replace(/replyTo:/g, "reply_to:");
  return `const { error } = await resend.emails.send({${mappedContents}});\n    if (error) {\n      console.error('Resend Error:', error);\n      throw new Error(error.message);\n    }`;
});

fs.writeFileSync('src/services/emailService.ts', code);
console.log("Updated emailService.ts to use Resend!");
