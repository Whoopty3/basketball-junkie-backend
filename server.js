const express = require("express");
const cors = require("cors");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const Joi = require("joi");

const app = express();

// Configure CORS to allow requests from the deployed frontend URL
const corsOptions = {
  origin: ['http://localhost:3004', 'https://whoopty3.github.io', 'https://whoopty3.github.io/basketball-junkie-react'], // Allow local and deployed frontend
};
app.use(cors(corsOptions));

app.use(express.static("public"));

// Configure multer for image uploads (optional)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/images/");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage: storage });

// Path to the players.json file
const playersFilePath = path.join(__dirname, "players.json");

// Serve players.json data at the root URL
app.get("/", (req, res) => {
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

// Endpoint to serve players.json data at /api/players
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

// Optional POST endpoint to add new players (if needed in the future)
app.post("/api/players", upload.single("img"), (req, res) => {
  const result = validatePlayer(req.body);

  if (result.error) {
    return res.status(400).send(result.error.details[0].message);
  }

  const newPlayer = {
    name: req.body.name,
    team: req.body.team,
    points: req.body.points,
    assists: req.body.assists,
    rebounds: req.body.rebounds,
    fieldGoalPercentage: req.body.fieldGoalPercentage,
    threePointPercentage: req.body.threePointPercentage,
  };

  if (req.file) {
    newPlayer.image = req.file.filename;
  }

  // Append new player to players.json file
  fs.readFile(playersFilePath, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading players.json:", err);
      return res.status(500).json({ error: "Failed to load players data" });
    }

    const players = JSON.parse(data);
    players.push(newPlayer);

    fs.writeFile(playersFilePath, JSON.stringify(players, null, 2), (writeErr) => {
      if (writeErr) {
        console.error("Error writing to players.json:", writeErr);
        return res.status(500).json({ error: "Failed to save player data" });
      }
      res.status(200).send(newPlayer);
    });
  });
});

// Validation for player data using Joi
const validatePlayer = (player) => {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
    team: Joi.string().min(3).required(),
    points: Joi.number().required(),
    assists: Joi.number().required(),
    rebounds: Joi.number().required(),
    fieldGoalPercentage: Joi.number().required(),
    threePointPercentage: Joi.number().required(),
  });

  return schema.validate(player);
};

// Start the server
const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
