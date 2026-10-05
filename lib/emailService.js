import nodemailer from 'nodemailer';

// Create reusable transporter object using Gmail SMTP
const createTransporter = () => {
  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'pravin.cse17@gmail.com',
      pass: process.env.NEXT_EMAIL_APP_PASSWORD, // App password from environment variable
    },
  });
};

// Send interview invitation email
export const sendInterviewInvitation = async (candidateEmail, candidateName, interviewTitle, interviewLink) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: 'pravin.cse17@gmail.com',
      to: candidateEmail,
      subject: `Interview Invitation - ${interviewTitle}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Interview Invitation</title>
          <style>
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              max-width: 600px;
              margin: 0 auto;
              padding: 20px;
            }
            .header {
              background-color: #007bff;
              color: white;
              padding: 20px;
              text-align: center;
              border-radius: 8px 8px 0 0;
            }
            .content {
              background-color: #f8f9fa;
              padding: 30px;
              border-radius: 0 0 8px 8px;
            }
            .button {
              display: inline-block;
              background-color: #007bff;
              color: white;
              padding: 12px 30px;
              text-decoration: none;
              border-radius: 5px;
              margin: 20px 0;
              font-weight: bold;
            }
            .button:hover {
              background-color: #0056b3;
            }
            .footer {
              margin-top: 30px;
              padding-top: 20px;
              border-top: 1px solid #dee2e6;
              font-size: 14px;
              color: #6c757d;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Interview Invitation</h1>
          </div>
          <div class="content">
            <h2>Hello ${candidateName},</h2>
            <p>You have been invited to participate in an interview for the position of <strong>${interviewTitle}</strong>.</p>
            <p>We are excited to learn more about your qualifications and discuss how you can contribute to our team.</p>
            <p>Please click the button below to start your interview:</p>
            <div style="text-align: center;">
              <a href="${interviewLink}" class="button">Start Interview</a>
            </div>
            <p><strong>Important Notes:</strong></p>
            <ul>
              <li>This link is unique to you and should not be shared with others</li>
              <li>Please ensure you have a stable internet connection</li>
              <li>You may need to allow camera and microphone access</li>
              <li>If you have any technical issues, please contact us immediately</li>
            </ul>
            <p>We look forward to speaking with you soon!</p>
            <p>Best regards,<br>The Interview Team</p>
          </div>
          <div class="footer">
            <p>This is an automated message. Please do not reply to this email.</p>
            <p>If you have any questions, please contact us through our support channels.</p>
          </div>
        </body>
        </html>
      `,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error: error.message };
  }
};

// Send test email
export const sendTestEmail = async (toEmail) => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: 'pravin.cse17@gmail.com',
      to: toEmail,
      subject: 'Test Email - Virtual Interview System',
      html: `
        <h2>Test Email</h2>
        <p>This is a test email from the Virtual Interview System.</p>
        <p>If you receive this email, the email service is working correctly!</p>
      `,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('Test email sent successfully:', result.messageId);
    return { success: true, messageId: result.messageId };
  } catch (error) {
    console.error('Error sending test email:', error);
    return { success: false, error: error.message };
  }
};
