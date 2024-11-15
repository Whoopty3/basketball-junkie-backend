const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');
const players = require('./players.json'); // Path to your players.json

// Use environment variable or fallback to default port
const defaultPort = 3001;
const port = process.env.PORT || defaultPort;

// Define API routes
app.get('/api/players', (req, res) => {
  res.json(players);  // Return players data as JSON
});

// Serve static files from 'public' folder (optional if you have frontend assets)
app.use(express.static(path.join(__dirname, 'public')));

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
