const nodemailer = require('nodemailer');

// FIX: Use createTransport (not createTransporter)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'noreply.hikecavite@gmail.com',
    pass: 'sgpzpnfgpboazqux'
  }
});

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { email, code } = req.body;
    
    await transporter.sendMail({
      from: 'Hike Cavite <noreply.hikecavite@gmail.com>',
      to: email,
      subject: 'Hike Cavite - Verification Code',
      html: `Your code: <strong>${code}</strong>`
    });

    res.status(200).json({ success: true, message: 'Email sent' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};