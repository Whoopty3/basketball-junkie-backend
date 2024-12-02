const express = require("express");
const fs = require("fs").promises;
const Joi = require("joi");
const multer = require("multer");
const path = require("path");

const app = express();
const playersFilePath = path.join(__dirname, "players.json");

// Configure multer
const storage = multer.diskStorage({
  destination: "./public/images/",
  filename: (req, file, cb) => cb(null, file.originalname),
});
const upload = multer({ storage });

// Player schema for validation
const schema = Joi.object({
  name: Joi.string().required(),
  team: Joi.string().required(),
  points: Joi.number().min(0).required(),
  assists: Joi.number().min(0).required(),
  rebounds: Joi.number().min(0).required(),
  fieldGoalPercentage: Joi.number().min(0).max(100).required(),
  threePointPercentage: Joi.number().min(0).max(100).required(),
});

// POST endpoint to add a player
app.post("/api/players", upload.single("img"), async (req, res) => {
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  const newPlayer = {
    name: req.body.name,
    team: req.body.team,
    points: parseFloat(req.body.points),
    assists: parseFloat(req.body.assists),
    rebounds: parseFloat(req.body.rebounds),
    fieldGoalPercentage: parseFloat(req.body.fieldGoalPercentage),
    threePointPercentage: parseFloat(req.body.threePointPercentage),
    image: req.file ? `/images/${req.file.filename}` : null,
  };

  try {
    const data = await fs.readFile(playersFilePath, "utf8");
    const players = JSON.parse(data);
    players.push(newPlayer);

    await fs.writeFile(playersFilePath, JSON.stringify(players, null, 2));
    res.status(201).json({ message: "Player added successfully", player: newPlayer });
  } catch (err) {
    console.error("Error handling players data:", err);
    res.status(500).json({ error: "Failed to process player data" });
  }
});

module.exports = app;
