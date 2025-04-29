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

  // Basic validation
  if (!videoUrl || !allowedDomains.some(domain => videoUrl.startsWith(domain))) {
    return res.status(400).send('Invalid or missing video URL');
  }

  try {
    console.log('Fetching:', videoUrl);
    const response = await axios.get(videoUrl, {
      headers: {
        'Referer': 'https://farsiland.com', // 👈 Spoof Referer for destination server
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/135.0.0.0 Safari/537.36',
        'Accept-Encoding': 'identity;q=1, *;q=0', // Avoid gzip chunk issues
        'Range': req.headers['range'] || 'bytes=0-' // Support video streaming and scrubbing
      },
      responseType: 'stream',
      timeout: 15000,
      validateStatus: status => true, // Accept any HTTP code
    });

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Content-Type', response.headers['content-type'] || 'video/mp4');

    if (response.headers['content-length']) {
      res.setHeader('Content-Length', response.headers['content-length']);
    }
    if (response.headers['content-range']) {
      res.setHeader('Content-Range', response.headers['content-range']);
      res.status(206); // Partial Content
    }

    response.data.pipe(res);
  } catch (error) {
    console.error('Proxy error:', error.message);
    res.status(500).send('Proxy error fetching the video.');
  }
});

app.listen(PORT, () => {
  console.log(`Proxy running on port ${PORT}`);
});
