const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const mongoose = require("mongoose");
const Joi = require("joi");

const app = express();

// Serve static files from the "public" directory
app.use(express.static("public"));

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Set up the image upload directory and filename
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/images/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "_" + file.originalname);
  },
});

// Image upload validation
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB file size limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/gif"];
    if (!allowedTypes.includes(file.mimetype)) {
      return cb(new Error("Invalid file type"), false);
    }
    cb(null, true);
  },
});

// CORS Configuration
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || /localhost/.test(origin) || origin === "https://whoopty3.github.io") {
        callback(null, true);
      } else {
        callback(new Error("CORS policy violation: Invalid origin"), false);
      }
    },
  })
);

// MongoDB connection
mongoose
  .connect("mongodb+srv://Whoopty3:Seminoles1@cluster0.tulc6.mongodb.net/Basketball?retryWrites=true&w=majority", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((error) => console.log("Couldn't connect to MongoDB", error));

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

// Fetch all players
app.get("/api/players", async (req, res) => {
  try {
    const players = await Player.find();
    res.status(200).json({ success: true, data: players });
  } catch (error) {
    res.status(500).json({ success: false, error: "Error fetching players" });
  }
});

// Add a new player
app.post("/api/players", upload.single("image"), async (req, res) => {
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
    res.status(201).json({ success: true, data: newPlayer });
  } catch (error) {
    res.status(500).json({ success: false, error: "Error saving player data" });
  }
});

// Update player details
app.put("/api/players/:id", upload.single("image"), async (req, res) => {
  const { error } = validatePlayer(req.body);
  if (error) return res.status(400).json({ success: false, error: error.details[0].message });

  try {
    const player = await Player.findById(req.params.id);
    if (!player) return res.status(404).json({ success: false, error: "Player not found" });

    player.name = req.body.name;
    player.team = req.body.team;
    player.position = req.body.position;
    player.points_per_game = req.body.points_per_game;
    player.assists_per_game = req.body.assists_per_game;
    player.rebounds_per_game = req.body.rebounds_per_game;
    player.field_goal_percentage = req.body.field_goal_percentage;
    player.three_point_percentage = req.body.three_point_percentage;

    if (req.file) {
      if (player.main_image) {
        fs.unlinkSync(path.join(__dirname, "public/images", player.main_image));
      }
      player.main_image = req.file.filename;
    }

    const updatedPlayer = await player.save();
    res.status(200).json({ success: true, data: updatedPlayer });
  } catch (error) {
    res.status(500).json({ success: false, error: "Error updating player data" });
  }
});

// Delete a player
app.delete("/api/players/:id", async (req, res) => {
  try {
    const player = await Player.findById(req.params.id);
    if (!player) return res.status(404).json({ success: false, error: "Player not found" });

    if (player.main_image) {
      fs.unlinkSync(path.join(__dirname, "public/images", player.main_image));
    }

    await Player.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: "Player deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, error: "Error deleting player" });
  }
});

// Player validation schema
const validatePlayer = (player) => {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
    team: Joi.string().min(2).required(),
    position: Joi.string().min(2).required(),
    points_per_game: Joi.number().required(),
    assists_per_game: Joi.number().required(),
    rebounds_per_game: Joi.number().required(),
    field_goal_percentage: Joi.number().required(),
    three_point_percentage: Joi.number().required(),
  });

  return schema.validate(player);
};

// Start the server
app.listen(3001, () => console.log("Listening on port 3001..."));
