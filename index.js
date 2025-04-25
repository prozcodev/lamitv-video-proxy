app.get('/proxy', async (req, res) => {
  const videoUrl = req.query.url;

  if (!videoUrl || !videoUrl.startsWith('https://d1.flnd.buzz')) {
    return res.status(400).send('Invalid or missing URL');
  }

  console.log(`Proxying: ${videoUrl}`);

  try {
    const response = await axios.get(videoUrl, {
      headers: {
        Referer: 'https://farsiland.com',
        'User-Agent': 'Mozilla/5.0 (Linux; Android 10) AppleWebKit/537.36 Chrome/135.0 Mobile Safari/537.36'
      },
      responseType: 'stream'
    });

    // ✅ Set headers + flush them immediately
    res.setHeader('Content-Type', 'video/mp4');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.flushHeaders(); // ⚡ sends headers right away, even if the stream isn't fully ready

    response.data.pipe(res);
  } catch (err) {
    console.error('Proxy error:', err.message);
    res.status(500).send('Could not load video');
  }
});
