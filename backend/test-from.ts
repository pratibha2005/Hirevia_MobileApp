import dotenv from 'dotenv';
dotenv.config();
import { sendOtpEmail } from './src/services/emailService';

console.log("SMTP_FROM:", process.env.SMTP_FROM);

const senderAddress = process.env.SMTP_FROM || process.env.SMTP_USER || 'no-reply@hirevia.com';
const senderName = 'Hirevia';
const fromField = `${senderName} <${senderAddress}>`;
console.log("from:", fromField);

sendOtpEmail('mehtasatyamm12@gmail.com', '123456')
  .then(() => console.log('OTP SENT!'))
  .catch(err => console.error('ERROR:', err));
