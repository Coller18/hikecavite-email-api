const nodemailer = require('nodemailer');

// Create transporter with YOUR Gmail credentials
const transporter = nodemailer.createTransporter({
  service: 'gmail',
  auth: {
    user: 'noreply.hikecavite@gmail.com',
    pass: 'nrjpdzkpicemfdce' // Your app password
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

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, code } = req.body;

    console.log('📧 Received request to send email to:', email);
    console.log('🔢 Code to send:', code);

    if (!email || !code) {
      return res.status(400).json({ error: 'Email and code are required' });
    }

    // Send email
    await transporter.sendMail({
      from: 'Hike Cavite <noreply.hikecavite@gmail.com>',
      to: email,
      subject: 'Hike Cavite - Verification Code',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #C2A634; text-align: center;">Hike Cavite</h2>
          <div style="background: #f9f9f9; padding: 20px; border-radius: 10px; border: 1px solid #ddd;">
            <h3 style="color: #333; margin-top: 0;">Email Verification</h3>
            <p>Hello,</p>
            <p>Your verification code for Hike Cavite is:</p>
            <div style="text-align: center; margin: 25px 0;">
              <span style="font-size: 32px; font-weight: bold; color: #C2A634; letter-spacing: 8px; background: #fff; padding: 15px 25px; border-radius: 8px; border: 2px dashed #C2A634;">
                ${code}
              </span>
            </div>
            <p>This code will expire in <strong>10 minutes</strong>.</p>
            <p>If you didn't request this code, please ignore this email.</p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
            <p style="color: #666; font-size: 12px;">Hike Cavite Team</p>
          </div>
        </div>
      `
    });

    console.log('✅ Email sent successfully to:', email);
    
    return res.status(200).json({ 
      success: true, 
      message: 'Verification code sent successfully' 
    });

  } catch (error) {
    console.error('❌ Email sending failed:', error);
    return res.status(500).json({ 
      error: 'Failed to send verification code: ' + error.message 
    });
  }
};