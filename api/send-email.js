export default async function handler(req, res) {
  console.log('✅ Function is working');
  
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
    
    console.log(`📧 Would send email to: ${email} with code: ${code}`);
    
    // For now, just return success without actually sending email
    // This proves the function works
    res.status(200).json({ 
      success: true, 
      message: 'Email would be sent to: ' + email,
      code: code
    });

  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ error: error.message });
  }
}