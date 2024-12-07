const express = require("express");
const cors = require("cors");
const fs = require("fs");
const app = express();
const Joi = require("joi");
app.use(express.static("public"));
const multer = require("multer");
const mongoose = require("mongoose");

// Middleware to parse JSON and URL-encoded data
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Set up the image upload directory and filename
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/images/");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
app.use(cors({
  origin: ['http://localhost:3000', 'https://whoopty3.github.io'], // Allow both development and production origins
}));

const upload = multer({ storage: storage });

// MongoDB connection string
mongoose
  .connect("mongodb+srv://Whoopty3:Seminoles1@cluster0.tulc6.mongodb.net/Basketball?retryWrites=true&w=majority")
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.log("Couldn't connect to MongoDB", error);
  });

const playerSchema = new mongoose.Schema({
  name: String,
  team: String,
  position: String,
  points_per_game: Number,
  assists_per_game: Number,
  rebounds_per_game: Number,
  field_goal_percentage: Number,
  three_point_percentage: Number,
  main_image: String,
});

const Player = mongoose.model("Player", playerSchema);

// Load players data from players.json
const getPlayersFromJson = () => {
  return JSON.parse(fs.readFileSync('players.json', 'utf-8'));
};

// Get request for index.html
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

// API endpoint to get all players from players.json
app.get("/api/players", async (req, res) => {
  try {
    // Fetch players from players.json file
    const players = getPlayersFromJson();
    res.status(200).send(players);
  } catch (error) {
    res.status(500).send("Error fetching players");
  }
});

// API endpoint to post new players (using MongoDB)
app.post("/api/players", upload.single("image"), async (req, res) => {
  // Check if body data exists
  if (!req.body || !req.body.name) {
    return res.status(400).send("Player name is required.");
  }

  // Validate player data using Joi schema
  const { error } = validatePlayer(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const player = new Player({
    name: req.body.name,
    team: req.body.team,
    position: req.body.position,
    points_per_game: req.body.points_per_game,
    assists_per_game: req.body.assists_per_game,
    rebounds_per_game: req.body.rebounds_per_game,
    field_goal_percentage: req.body.field_goal_percentage,
    three_point_percentage: req.body.three_point_percentage,
  });

  if (req.file) {
    player.main_image = req.file.filename;
  }

  try {
    const newPlayer = await player.save();
    res.status(200).send(newPlayer);
  } catch (error) {
    res.status(500).send("Error saving player data");
  }
});

// API endpoint to update a player's details by ID (using MongoDB)
app.put("/api/players/:id", upload.single("img"), async (req, res) => {
  const result = validatePlayer(req.body);

  if (result.error) {
    res.status(400).send(result.error.details[0].message);
    return;
  }

  const fieldsToUpdate = {
    name: req.body.name,
    team: req.body.team,
    position: req.body.position,
    points_per_game: req.body.points_per_game,
    assists_per_game: req.body.assists_per_game,
    rebounds_per_game: req.body.rebounds_per_game,
    field_goal_percentage: req.body.field_goal_percentage,
    three_point_percentage: req.body.three_point_percentage,
  };

  if (req.file) {
    fieldsToUpdate.main_image = req.file.filename;
  }

  try {
    const updatedPlayer = await Player.updateOne(
      { _id: req.params.id },
      fieldsToUpdate
    );

    const player = await Player.findOne({ _id: req.params.id });
    res.status(200).send(player);
  } catch (error) {
    res.status(500).send("Error updating player data");
  }
});

// API endpoint to delete a player by ID (using MongoDB)
app.delete("/api/players/:id", async (req, res) => {
  try {
    const player = await Player.findByIdAndDelete(req.params.id);
    res.status(200).send(player);
  } catch (error) {
    res.status(500).send("Error deleting player");
  }
});

// Validation schema using Joi
const validatePlayer = (player) => {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
    team: Joi.string().min(3).required(),
    position: Joi.string().min(3).required(),
    points_per_game: Joi.number().required(),
    assists_per_game: Joi.number().required(),
    rebounds_per_game: Joi.number().required(),
    field_goal_percentage: Joi.number().required(),
    three_point_percentage: Joi.number().required(),
  });

  return schema.validate(player);
};

// Start the server
app.listen(3001, () => {
  console.log("Listening on port 3001...");
});
