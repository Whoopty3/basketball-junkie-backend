const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors'); // Make sure cors is imported

const app = express();
const port = process.env.PORT || 3001;

// Set up CORS to allow requests from your frontend domain
app.use(cors({
  origin: 'http://localhost:3000', // Update this URL to your frontend's local development URL
}));

// Serve players.json data at the root URL
app.get('/', (req, res) => {
  const playersFilePath = path.join(__dirname, 'players.json'); // Get the absolute path to players.json

  fs.readFile(playersFilePath, 'utf8', (err, data) => {
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

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
