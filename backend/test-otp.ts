import dotenv from 'dotenv';
dotenv.config();
import { sendOtpEmail } from './src/services/emailService';

sendOtpEmail('mehtasatyamm12@gmail.com', '123456')
  .then(() => console.log('OTP SENT!'))
  .catch(err => console.error('ERROR:', err));
