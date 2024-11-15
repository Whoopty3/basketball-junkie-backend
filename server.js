const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');
const players = require('./players.json'); // Path to your players.json

const defaultPort = 3001;
let port = defaultPort;

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
  let tryPort = defaultPort;
  while (await checkPortInUse(tryPort)) {
    tryPort++;
  }
  return tryPort;
};

// Set the port to the first available one
findAvailablePort().then((availablePort) => {
  port = availablePort;
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}).catch((err) => {
  console.error('Error finding available port:', err);
});

// Define API routes
app.get('/api/players', (req, res) => {
  res.json(players);
});

app.use(express.static(path.join(__dirname, 'public'))); // Serve static files from 'public' folder

