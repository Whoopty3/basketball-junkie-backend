const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');
const players = require('./players.json'); // Path to your players.json

// Serve static files from 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Serve the index.html file for the root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html')); // Serve the index.html from public folder
});

// Define API routes
app.get('/api/players', (req, res) => {
  res.json(players); // Serve the players data as JSON
});

// Function to check if a port is in use
const checkPortInUse = (port) => {
  return new Promise((resolve, reject) => {
    const server = app.listen(port, () => {
      server.close(); // Close the server immediately if the port is available
      resolve(false);
    }).on('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        resolve(true); // Port is already in use
      } else {
        reject(err);
      }
    });
  });
};

// Function to find an available port
const findAvailablePort = async () => {
  let tryPort = 3001; // Starting with port 3001
  while (await checkPortInUse(tryPort)) {
    tryPort++; // Try the next port if the current one is in use
  }
  return tryPort;
};

// Set the port to the first available one
findAvailablePort().then((availablePort) => {
  app.listen(availablePort, () => {
    console.log(`Server is running on port ${availablePort}`);
  });
}).catch((err) => {
  console.error('Error finding available port:', err);
});
