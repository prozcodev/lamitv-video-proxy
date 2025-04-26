const express = require('express');
const axios = require('axios');
const app = express();

const PORT = process.env.PORT || 3000;

// Allowed domains
const allowedDomains = [
  'https://d1.flnd.buzz',
  'https://p1.flnd.buzz',
];

app.get('/', (req, res) => {
  res.send('🎥 LamiTV Proxy is running');
});

app.get('/proxy', async (req, res) => {
  const videoUrl = req.query.url;

  // Basic validation: allow multiple origins
  if (
    !videoUrl ||
    !allowedDomains.some(domain => videoUrl.startsWith(domain))
  ) {
    return res.status(400).send('Invalid or missing video URL');
  }

  try {
    const response = await axios.get(videoUrl, {
      headers: {
        Referer: 'https://farsiland.com',
        'User-Agent': 'Mozilla/5.0 (Linux; Android 10) AppleWebKit/537.36 Chrome/135.0 Mobile Safari/537.36'
      },
      responseType: 'stream',
      timeout: 10000,
    });

    res.setHeader('Content-Type', 'video/mp4');
    res.setHeader('Access-Control-Allow-Origin', '*');
    response.data.pipe(res);
  } catch (err) {
    console.error('Proxy error:', err.message);
    res.status(500).send('Could not load video');
  }
});

app.listen(PORT, () => {
  console.log(`Proxy running on port ${PORT}`);
});
