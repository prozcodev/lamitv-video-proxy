const express = require('express');
const axios = require('axios');
const app = express();

const PORT = process.env.PORT || 3000;

app.get('/proxy', async (req, res) => {
  const videoPath = req.query.path;
  if (!videoPath || !videoPath.startsWith('/')) {
    return res.status(400).send('Invalid path');
  }

  const videoUrl = `https://d1.flnd.buzz${videoPath}`;
  console.log(`Proxying: ${videoUrl}`);

  try {
    const response = await axios.get(videoUrl, {
      headers: {
        Referer: 'https://farsiland.com',
        'User-Agent': 'Mozilla/5.0 (Linux; Android 10; SM-G973F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/135.0.0.0 Mobile Safari/537.36'
      },
      responseType: 'stream'
    });

    console.log('Video stream started successfully.');

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
