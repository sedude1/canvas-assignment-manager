module.exports = async (req, res) => {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-Canvas-Url, X-Api-Key');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const canvasUrl = req.headers['x-canvas-url'];
    const apiKey = req.headers['x-api-key'];
    
    if (!canvasUrl || !apiKey) {
      return res.status(400).json({ 
        error: 'Missing Canvas URL or API key in headers' 
      });
    }

    // Extract the Canvas API path from the request URL
    const canvasPath = req.url.replace('/api/canvas', '');
    const fullUrl = `${canvasUrl}/api/v1${canvasPath}`;
    
    console.log(`Proxying request to: ${fullUrl}`);
    
    const response = await fetch(fullUrl, {
      method: req.method,
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'User-Agent': 'Canvas-Assignment-Manager/1.0'
      },
      body: req.method !== 'GET' ? JSON.stringify(req.body) : undefined
    });

    console.log(`Canvas API response status: ${response.status}`);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Canvas API Error: ${response.status} ${response.statusText} - ${errorText}`);
      return res.status(response.status).json({
        error: `Canvas API Error: ${response.status} ${response.statusText}`,
        details: errorText
      });
    }

    const data = await response.json();
    console.log(`Successfully proxied request, returning ${Array.isArray(data) ? data.length : 'object'} items`);
    res.json(data);
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ 
      error: 'Proxy server error', 
      details: error.message 
    });
  }
};
