const nodemailer = require('nodemailer');

console.log('✅ Email function loading...');

const transporter = nodemailer.createTransporter({
  service: 'gmail',
  auth: {
    user: 'noreply.hikecavite@gmail.com',
    pass: 'sgpzpnfgpboazqux'
  }
});

module.exports = async (req, res) => {
  console.log('🚀 Function called');
  
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    console.log('✅ Preflight handled');
    return res.status(200).end();
  }

  // Only POST allowed
  if (req.method !== 'POST') {
    console.log('❌ Method not allowed:', req.method);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('📦 Request body:', JSON.stringify(req.body));
    
    const { email, code } = req.body;

    if (!email || !code) {
      return res.status(400).json({ error: 'Email and code required' });
    }

    console.log(`📧 Sending to: ${email}, Code: ${code}`);

    // Send email
    const mailOptions = {
      from: 'Hike Cavite <noreply.hikecavite@gmail.com>',
      to: email,
      subject: 'Hike Cavite - Verification Code',
      html: `<h2>Your verification code: ${code}</h2>`
    };

    const result = await transporter.sendMail(mailOptions);
    console.log('✅ Email sent:', result.messageId);

    res.status(200).json({ 
      success: true, 
      message: 'Email sent successfully' 
    });

  } catch (error) {
    console.error('❌ Error:', error);
    res.status(500).json({ 
      error: error.message,
      code: error.code 
    });
  }
};