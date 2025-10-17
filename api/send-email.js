module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { email, code } = req.body;
  
  // Just return success for now - prove the API works
  res.status(200).json({ 
    success: true, 
    message: 'API is working',
    email: email,
    code: code 
  });
};