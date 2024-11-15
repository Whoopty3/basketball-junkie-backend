// Route for serving players data
app.get('/api/players', (req, res) => {
  fs.readFile(path.join(__dirname, 'players.json'), 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading players.json:', err);
      return res.status(500).json({ error: 'Failed to load players data' });
    }

    try {
      const players = JSON.parse(data); // Parse the JSON data
      res.json(players); // Send the players data as JSON
    } catch (parseError) {
      console.error('Error parsing players.json:', parseError);
      res.status(500).json({ error: 'Failed to parse players data' });
    }
  });
});
