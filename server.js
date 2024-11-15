const express = require('express');
const path = require('path');
const fs = require('fs');
const cors = require('cors');


const app = express();
const port = process.env.PORT || 3001; // Use environment port or default to 3001

// Serve static files from the 'public' directory
app.use(cors({
  origin: 'https://whoopty3.github.io'}));

// Route for serving players data at the root URL
app.get('/', (req, res) => {
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

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
