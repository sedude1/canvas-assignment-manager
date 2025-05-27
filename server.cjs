const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const PORT = 3003;

// Enable CORS for all routes
app.use(cors());
app.use(express.json());

// Proxy endpoint for Canvas API - using a more specific pattern
app.use('/api/canvas', async (req, res) => {
  try {
    const canvasPath = req.path;
    const canvasUrl = req.headers['x-canvas-url'];
    const apiKey = req.headers['x-api-key'];
    
    console.log(`Received proxy request: ${req.method} ${req.path}`);
    console.log(`Canvas URL: ${canvasUrl}`);
    console.log(`API Key: ${apiKey ? 'PROVIDED' : 'MISSING'}`);
    
    if (!canvasUrl || !apiKey) {
      return res.status(400).json({ 
        error: 'Missing Canvas URL or API key in headers' 
      });
    }

    // Build the full URL with query parameters
    const queryString = req.url.split('?')[1] || '';
    const fullUrl = `${canvasUrl}/api/v1${canvasPath}${queryString ? '?' + queryString : ''}`;
    
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
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Canvas API Proxy Server is running' });
});

app.listen(PORT, () => {
  console.log(`🚀 Canvas API Proxy Server running on http://localhost:${PORT}`);
  console.log(`📡 Ready to proxy Canvas API requests`);
  console.log(`🔧 Test the proxy: curl http://localhost:${PORT}/health`);
});
