const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3001;

// Allow requests from your frontend URL
app.use(cors({
  origin: 'https://basketball-junkie-backend.onrender.com',  // Replace this with your frontend URL
}));

// Serve static files (optional, if you have static files like images)
app.use(express.static(path.join(__dirname, 'public')));

// Endpoint to serve players data
app.get('/players', (req, res) => {
  const playersFilePath = path.join(__dirname, 'players.json'); // File containing player data

  fs.readFile(playersFilePath, 'utf8', (err, data) => {
    if (err) {
      console.error('Error reading players.json:', err);
      return res.status(500).json({ error: 'Failed to load players data' });
    }

    try {
      const players = JSON.parse(data);
      res.json(players); // Send the players data as a response
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
