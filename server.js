const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();

// CORS configuration
const corsOptions = {
  origin: [
    /^http:\/\/localhost:\d+$/, // Allow all localhost ports
    "https://whoopty3.github.io", // Allow deployed frontend URL
    "https://whoopty3.github.io/basketball-junkie-react", // Allow deployed React app
  ],
  methods: ["GET", "POST"], // Specify allowed HTTP methods
  allowedHeaders: ["Content-Type", "Authorization"], // Specify allowed headers
};
app.use(cors(corsOptions));

// Serve static files
app.use(express.static("public"));

// Path to the `players.json` file
const playersFilePath = path.join(__dirname, "players.json");

// Endpoint to serve players data
app.get("/api/players", (req, res) => {
  fs.readFile(playersFilePath, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading players.json:", err);
      return res.status(500).json({ error: "Failed to load players data" });
    }

    try {
      const players = JSON.parse(data);
      res.json(players);
    } catch (parseError) {
      console.error("Error parsing players.json:", parseError);
      res.status(500).json({ error: "Failed to parse players data" });
    }
  });
});

// Start the server
const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
