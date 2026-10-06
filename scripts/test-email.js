// Test script for email functionality
// Run with: node scripts/test-email.js

const nodemailer = require('nodemailer');

// Test email configuration
const testEmail = async () => {
  try {
    console.log('Testing email configuration...');
    
    // Check if environment variable is set
    if (!process.env.NEXT_EMAIL_APP_PASSWORD) {
      console.error('❌ NEXT_EMAIL_APP_PASSWORD environment variable is not set');
      console.log('Please set it in your .env.local file');
      return;
    }

    // Create transporter
    const transporter = nodemailer.createTransporter({
      service: 'gmail',
      auth: {
        user: 'pravin.cse17@gmail.com',
        pass: process.env.NEXT_EMAIL_APP_PASSWORD,
      },
    });

    // Verify connection
    await transporter.verify();
    console.log('✅ Email server connection verified successfully');

    // Send test email
    const testEmail = 'test@example.com'; // Replace with your test email
    const mailOptions = {
      from: 'pravin.cse17@gmail.com',
      to: testEmail,
      subject: 'Test Email - Virtual Interview System',
      html: `
        <h2>Test Email</h2>
        <p>This is a test email from the Virtual Interview System.</p>
        <p>If you receive this email, the email service is working correctly!</p>
        <p>Timestamp: ${new Date().toISOString()}</p>
      `,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('✅ Test email sent successfully!');
    console.log('Message ID:', result.messageId);
    console.log('To:', testEmail);

  } catch (error) {
    console.error('❌ Error testing email:', error.message);
    
    if (error.message.includes('Invalid login')) {
      console.log('\n💡 Troubleshooting tips:');
      console.log('1. Make sure you have enabled 2-Factor Authentication on your Gmail account');
      console.log('2. Generate a new App Password from Google Account settings');
      console.log('3. Use the App Password (not your regular password) in NEXT_EMAIL_APP_PASSWORD');
    }
  }
};

// Load environment variables
require('dotenv').config({ path: '.env.local' });

testEmail();

