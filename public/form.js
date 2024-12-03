const express = require("express");
const fs = require("fs").promises;
const Joi = require("joi");
const multer = require("multer");
const path = require("path");

const router = express.Router();
const playersFilePath = path.join(__dirname, "players.json");

// Configure multer for image upload
const storage = multer.diskStorage({
  destination: "./public/images/", // Destination folder for uploaded images
  filename: (req, file, cb) => cb(null, file.originalname), // File name as original name
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
router.post("/", upload.single("img"), async (req, res) => {
  // Validate the input data
  const { error } = schema.validate(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }

  // Create the new player object
  const newPlayer = {
    name: req.body.name,
    team: req.body.team,
    points: parseFloat(req.body.points),
    assists: parseFloat(req.body.assists),
    rebounds: parseFloat(req.body.rebounds),
    fieldGoalPercentage: parseFloat(req.body.fieldGoalPercentage),
    threePointPercentage: parseFloat(req.body.threePointPercentage),
    image: req.file ? `/images/${req.file.filename}` : null, // Save image path
  };

  try {
    // Read existing players from JSON file
    const data = await fs.readFile(playersFilePath, "utf8");
    const players = JSON.parse(data);

    // Add the new player to the array
    players.push(newPlayer);

    // Write the updated data back to the file
    await fs.writeFile(playersFilePath, JSON.stringify(players, null, 2));

    // Return success response
    res.status(201).json({ message: "Player added successfully", player: newPlayer });
  } catch (err) {
    console.error("Error handling players data:", err);
    res.status(500).json({ error: "Failed to process player data" });
  }
});

module.exports = router;
