const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');
const app = express();

console.log('🚀 Starting Google Ads API Proxy Server...');

// Simple CORS middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, Accept');
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

app.use(express.json({ limit: '10mb' }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Google Ads API Proxy is running' });
});

// Proxy endpoint for Google Ads API
app.post('/api/google-ads-proxy', async (req, res) => {
  try {
    console.log('📡 Proxying request to:', req.body.url);
    
    const { url, method, headers, body } = req.body;
    
    const fetchOptions = {
      method: method || 'GET',
      headers: headers || {}
    };
    
    if (body) {
      if (typeof body === 'string') {
        fetchOptions.body = body;
      } else {
        fetchOptions.body = JSON.stringify(body);
      }
    }
    
    const response = await fetch(url, fetchOptions);
    const data = await response.json();
    
    console.log('✅ Response received, forwarding to dashboard');
    res.json(data);
    
  } catch (error) {
    console.error('❌ Proxy error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ Proxy server running on http://localhost:${PORT}`);
  console.log('🔗 Dashboard can now make real API calls through this proxy');
  console.log('🌐 CORS enabled for external access');
});
