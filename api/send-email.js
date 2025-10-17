import nodemailer from 'nodemailer';

console.log('✅ Function loading...');

const transporter = nodemailer.createTransporter({
  service: 'gmail',
  auth: {
    user: process.env.GMAIL_USER || 'noreply.hikecavite@gmail.com',
    pass: process.env.GMAIL_APP_PASSWORD || 'sgpzpnfgpboazqux'
  }
});

export default async function handler(req, res) {
  console.log('🚀 Function executed');
  
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
    console.log(`📧 Sending to: ${email}`);

    await transporter.sendMail({
      from: 'Hike Cavite <noreply.hikecavite@gmail.com>',
      to: email,
      subject: 'Hike Cavite - Verification Code',
      html: `Your code: <strong>${code}</strong>`
    });

    res.status(200).json({ success: true, message: 'Email sent' });
    
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
}