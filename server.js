const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3001;

// Allow requests from your frontend URL (React app hosted elsewhere)
app.use(cors({
  origin: ['https://basketball-junkie-frontend.onrender.com', 'http://localhost:3001'], // Update with your deployed frontend URL and local development URL
  methods: ['GET'], // Only allow GET requests, adjust as needed
}));

// Serve static files (like images or assets) if needed
app.use(express.static(path.join(__dirname, 'public')));

// Endpoint to serve players.json
app.get('/players', (req, res) => {
  const playersFilePath = path.join(__dirname, 'players.json');

  fs.readFile(playersFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading players.json:', err);
      return res.status(500).json({ error: 'Failed to load players data' });
    }

    try {
      const players = JSON.parse(data);
      res.json(players);
    } catch (parseError) {
      console.error('Error parsing players.json:', parseError);
      res.status(500).json({ error: 'Failed to parse players data' });
    }
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
