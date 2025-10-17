import nodemailer from 'nodemailer';

// Simple transporter - remove auth temporarily to test
const transporter = nodemailer.createTransporter({
  service: 'gmail',
  auth: {
    user: 'noreply.hikecavite@gmail.com',
    pass: 'sgpzpnfgpboazqux' // Your app password here
  }
});

export default async function handler(req, res) {
  console.log('🚀 Email API called');
  
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { email, code } = req.body;
    console.log('📧 Received request for:', email);

    if (!email || !code) {
      return res.status(400).json({ error: 'Email and code required' });
    }

    console.log('📤 Attempting to send email...');

    // Send email
    const mailResult = await transporter.sendMail({
      from: 'Hike Cavite <noreply.hikecavite@gmail.com>',
      to: email,
      subject: 'Hike Cavite - Verification Code',
      html: `
        <div style="font-family: Arial, sans-serif;">
          <h2 style="color: #C2A634;">Hike Cavite</h2>
          <p>Your verification code is: <strong>${code}</strong></p>
          <p>This code will expire in 10 minutes.</p>
        </div>
      `
    });

    console.log('✅ Email sent successfully:', mailResult.messageId);

    res.status(200).json({ 
      success: true, 
      message: 'Verification code sent successfully'
    });
    
  } catch (error) {
    console.error('❌ Email error:', error);
    
    // More specific error response
    res.status(500).json({ 
      success: false,
      error: error.message,
      code: error.code
    });
  }
}