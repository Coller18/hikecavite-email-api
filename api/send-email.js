export default async function handler(req, res) {
  console.log('🚀 Send-email function called');
  
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    console.log('✅ Preflight handled');
    return res.status(200).end();
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    console.log('❌ Method not allowed:', req.method);
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    console.log('📦 Request body:', req.body);
    
    const { email, code } = req.body;
    
    if (!email || !code) {
      return res.status(400).json({ 
        error: 'Email and code are required',
        received: { email, code }
      });
    }

    console.log(`📧 Would send email to: ${email} with code: ${code}`);
    
    // For now, just return success without actually sending email
    // This helps us verify the API is working
    res.status(200).json({ 
      success: true, 
      message: 'API is working! Email would be sent to: ' + email,
      code: code,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Error:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      details: error.message 
    });
  }
}