require("dotenv").config();
const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const app = express();
const Joi = require("joi");
const multer = require("multer");
const mongoose = require("mongoose");

// Serve static files from the "public" directory
app.use(express.static("public"));

// Middleware to parse JSON and URL-encoded data
app.use(express.json()); // Parse JSON bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded bodies

// Set up the image upload directory and filename
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/images/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "_" + file.originalname);  // Use a unique filename
  },
});

// Image upload validation
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 },  // 5 MB file size limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error("Invalid file type"), false);
    }
    cb(null, true);
  }
});

// CORS Configuration
app.use(cors({
  origin: (origin, callback) => {
    // Allow localhost during development and your production frontend
    if (!origin || /localhost/.test(origin) || origin === "https://whoopty3.github.io") {
      callback(null, true); // Allow localhost and production frontend
    } else {
      callback(new Error("CORS policy violation: Invalid origin"), false);
    }
  },
}));

// MongoDB connection string (preserved as per your request)
const mongoURI = "mongodb+srv://Whoopty3:Seminoles1@cluster0.tulc6.mongodb.net/Basketball?retryWrites=true&w=majority";
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.log("Couldn't connect to MongoDB", error);
  });

// Define the Player schema and model
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

// Get request for index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// API endpoint to get all players from MongoDB
app.get("/api/players", async (req, res) => {
  try {
    const players = await Player.find();
    res.status(200).json({ success: true, data: players });
  } catch (error) {
    res.status(500).json({ success: false, error: "Error fetching players" });
  }
});

// API endpoint to post new players (using MongoDB)
app.post("/api/players", upload.single("image"), async (req, res) => {
  if (!req.body || !req.body.name) {
    return res.status(400).json({ success: false, error: "Player name is required." });
  }

  // Validate player data using Joi schema
  const { error } = validatePlayer(req.body);
  if (error) return res.status(400).json({ success: false, error: error.details[0].message });

  const player = new Player({
    name: req.body.name,
    team: req.body.team,
    position: req.body.position,
    points_per_game: req.body.points_per_game,
    assists_per_game: req.body.assists_per_game,
    rebounds_per_game: req.body.rebounds_per_game,
    field_goal_percentage: req.body.field_goal_percentage,
    three_point_percentage: req.body.three_point_percentage,
    main_image: req.file ? req.file.filename : null,
  });

  try {
    const newPlayer = await player.save();
    res.status(200).json({ success: true, data: newPlayer });
  } catch (error) {
    res.status(500).json({ success: false, error: "Error saving player data" });
  }
});

// API endpoint to update a player's details by ID (using MongoDB)
app.put("/api/players/:id", upload.single("img"), async (req, res) => {
  const { error } = validatePlayer(req.body);
  if (error) return res.status(400).json({ success: false, error: error.details[0].message });

  try {
    const player = await Player.findById(req.params.id);
    if (!player) {
      return res.status(404).json({ success: false, error: "Player not found" });
    }

    player.name = req.body.name;
    player.team = req.body.team;
    player.position = req.body.position;
    player.points_per_game = req.body.points_per_game;
    player.assists_per_game = req.body.assists_per_game;
    player.rebounds_per_game = req.body.rebounds_per_game;
    player.field_goal_percentage = req.body.field_goal_percentage;
    player.three_point_percentage = req.body.three_point_percentage;

    if (req.file) {
      // Delete old image from the server if a new one is uploaded
      if (player.main_image) {
        const oldImagePath = path.join(__dirname, 'public/images', player.main_image);
        fs.unlinkSync(oldImagePath);
      }
      player.main_image = req.file.filename;
    }

    const updatedPlayer = await player.save();
    res.status(200).json({ success: true, data: updatedPlayer });
  } catch (error) {
    res.status(500).json({ success: false, error: "Error updating player data" });
  }
});

// API endpoint to delete a player by ID (using MongoDB)
app.delete("/api/players/:id", async (req, res) => {
  try {
    const player = await Player.findById(req.params.id);
    if (!player) {
      return res.status(404).json({ success: false, error: "Player not found" });
    }

    // Delete image file
    if (player.main_image) {
      const imagePath = path.join(__dirname, "public/images", player.main_image);
      fs.unlinkSync(imagePath);
    }

    await player.delete();
    res.status(200).json({ success: true, message: "Player deleted" });
  } catch (error) {
    res.status(500).json({ success: false, error: "Error deleting player data" });
  }
});

// Function to validate player data using Joi
function validatePlayer(player) {
  const schema = Joi.object({
    name: Joi.string().required(),
    team: Joi.string().required(),
    position: Joi.string().required(),
    points_per_game: Joi.number().min(0).max(50).required(),
    assists_per_game: Joi.number().min(0).max(15).required(),
    rebounds_per_game: Joi.number().min(0).max(15).required(),
    field_goal_percentage: Joi.number().min(0).max(100).required(),
    three_point_percentage: Joi.number().min(0).max(100).required(),
  });

  return schema.validate(player);
}

// Listen on port 3000
app.listen(3000, () => {
  console.log("Server is running on http://localhost:3000");
});
