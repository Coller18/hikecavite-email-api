const nodemailer = require('nodemailer');

// Create transporter outside the handler for better performance
const transporter = nodemailer.createTransporter({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER || 'noreply.hikecavite@gmail.com',
    pass: process.env.GMAIL_APP_PASSWORD || 'sgpzpnfgpboazqux'
  }
});

module.exports = async (req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, code } = req.body;
    
    console.log('Received request to send email to:', email);
    
    // Validate required fields
    if (!email || !code) {
      return res.status(400).json({ 
        error: 'Email and code are required',
        received: { email, code }
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ 
        error: 'Invalid email format' 
      });
    }

    // Send email
    const mailOptions = {
      from: 'Hike Cavite <noreply.hikecavite@gmail.com>',
      to: email,
      subject: 'Hike Cavite - Verification Code',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #C2A634; text-align: center;">Hike Cavite</h2>
          <div style="background: #f9f9f9; padding: 20px; border-radius: 10px; border-left: 4px solid #C2A634;">
            <p style="font-size: 16px;">Your verification code is:</p>
            <h1 style="color: #C2A634; text-align: center; font-size: 32px; letter-spacing: 5px; margin: 20px 0;">
              ${code}
            </h1>
            <p style="font-size: 14px; color: #666;">This code will expire in 10 minutes.</p>
          </div>
          <p style="font-size: 12px; color: #999; text-align: center; margin-top: 20px;">
            If you didn't request this code, please ignore this email.
          </p>
        </div>
      `
    };

    console.log('Attempting to send email...');
    const result = await transporter.sendMail(mailOptions);
    console.log('Email sent successfully:', result.messageId);

    res.status(200).json({ 
      success: true, 
      message: 'Verification code sent successfully',
      messageId: result.messageId
    });

  } catch (error) {
    console.error('Email sending error:', error);
    
    // More specific error handling
    if (error.code === 'EAUTH') {
      return res.status(500).json({ 
        error: 'Authentication failed - check email credentials',
        details: 'Invalid Gmail app password or username'
      });
    } else if (error.code === 'EENVELOPE') {
      return res.status(400).json({ 
        error: 'Invalid email address',
        details: 'The recipient email address is invalid'
      });
    } else {
      return res.status(500).json({ 
        error: 'Failed to send email',
        details: error.message,
        code: error.code
      });
    }
  }
};