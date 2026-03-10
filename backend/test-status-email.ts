/**
 * Test script to verify application status email notifications work
 * Run with: npx ts-node test-status-email.ts
 */

import { config } from 'dotenv';
import path from 'path';
import { sendApplicationStatusEmail } from './src/services/emailService';

// Load environment variables
config({ path: path.join(__dirname, '.env') });

const testStatusEmail = async () => {
    console.log('\n🧪 Testing Application Status Email Notification...\n');
    
    // Check SMTP configuration
    console.log('📧 SMTP Configuration:');
    console.log('  Host:', process.env.SMTP_HOST || '❌ NOT SET');
    console.log('  Port:', process.env.SMTP_PORT || '❌ NOT SET');
    console.log('  User:', process.env.SMTP_USER || '❌ NOT SET');
    console.log('  Pass:', process.env.SMTP_PASS ? '✅ SET (hidden)' : '❌ NOT SET');
    console.log('  From:', process.env.SMTP_FROM || process.env.SMTP_USER || '❌ NOT SET');
    console.log();

    if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
        console.log('❌ SMTP is not configured. Please set these variables in backend/.env:');
        console.log('   SMTP_HOST=smtp.gmail.com');
        console.log('   SMTP_PORT=587');
        console.log('   SMTP_USER=your-email@gmail.com');
        console.log('   SMTP_PASS=your-app-password');
        console.log('   SMTP_FROM=your-email@gmail.com (optional)\n');
        process.exit(1);
    }

    // Test data
    const testEmail = process.argv[2] || 'candidate@example.com';
    const testStatus = (process.argv[3] || 'Shortlisted') as 'Shortlisted' | 'Rejected';

    console.log('📨 Sending test email:');
    console.log('  To:', testEmail);
    console.log('  Status:', testStatus);
    console.log('  Company: Test Company Inc.');
    console.log('  Job: Senior Software Engineer');
    console.log();

    try {
        await sendApplicationStatusEmail({
            candidateName: 'Test Candidate',
            candidateEmail: testEmail,
            companyName: 'Test Company Inc.',
            jobTitle: 'Senior Software Engineer',
            status: testStatus
        });

        console.log('✅ SUCCESS! Email sent successfully.');
        console.log('📬 Check the inbox of:', testEmail);
        console.log();
        console.log('If this test worked, the feature should work in your app.');
        console.log('If you didn\'t receive the email:');
        console.log('  1. Check spam/junk folder');
        console.log('  2. Verify the email address is correct');
        console.log('  3. Check SMTP credentials are valid');
        console.log();
    } catch (error: any) {
        console.log('❌ FAILED to send email.');
        console.log();
        console.log('Error details:');
        console.log('  Message:', error.message);
        console.log('  Code:', error.code);
        console.log();
        
        if (error.message.includes('Invalid login')) {
            console.log('💡 TIP: Invalid login usually means:');
            console.log('   - Wrong username/password');
            console.log('   - For Gmail: You need an "App Password" not your regular password');
            console.log('   - Enable 2FA on Gmail, then create App Password at:');
            console.log('     https://myaccount.google.com/apppasswords');
        } else if (error.message.includes('ENOTFOUND') || error.message.includes('ECONNREFUSED')) {
            console.log('💡 TIP: Connection error usually means:');
            console.log('   - Wrong SMTP host or port');
            console.log('   - Network/firewall blocking connection');
            console.log('   - For Gmail use: smtp.gmail.com:587');
        }
        console.log();
        process.exit(1);
    }
};

// Usage instructions
if (process.argv.includes('--help') || process.argv.includes('-h')) {
    console.log('\n📧 Application Status Email Test Script\n');
    console.log('Usage:');
    console.log('  npx ts-node test-status-email.ts [email] [status]');
    console.log();
    console.log('Arguments:');
    console.log('  email   - Recipient email address (default: candidate@example.com)');
    console.log('  status  - Shortlisted or Rejected (default: Shortlisted)');
    console.log();
    console.log('Examples:');
    console.log('  npx ts-node test-status-email.ts');
    console.log('  npx ts-node test-status-email.ts john@example.com');
    console.log('  npx ts-node test-status-email.ts john@example.com Rejected');
    console.log();
    process.exit(0);
}

testStatusEmail();
