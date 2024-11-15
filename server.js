const express = require('express');
const path = require('path');
const fs = require('fs'); // To read the players.json file
const cors = require('cors'); // Import CORS

const app = express();
const port = process.env.PORT || 3001; // Use environment port or default to 3001

// Enable CORS for all origins
app.use(cors());

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

// Add a route for the root URL
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Basketball Junkie API!' });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
