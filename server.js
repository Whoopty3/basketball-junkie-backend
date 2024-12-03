const express = require("express");
const cors = require("cors");
const multer = require("multer");
const Joi = require("joi");

const app = express();

// Middleware
app.use(cors());
app.use(express.static("public"));
app.use(express.json());

// Multer setup for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/images/");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

// In-memory database of players
const players = [
  {
    _id: 1,
    name: "LeBron James",
    team: "Los Angeles Lakers",
    position: "SF",
    points_per_game: 25.7,
    assists_per_game: 7.8,
    rebounds_per_game: 7.8,
    field_goal_percentage: 50.4,
    three_point_percentage: 30.8,
    main_image: "lebron_james.webp",
  },
  {
    _id: 2,
    name: "Stephen Curry",
    team: "Golden State Warriors",
    position: "PG",
    points_per_game: 30.0,
    assists_per_game: 6.6,
    rebounds_per_game: 5.2,
    field_goal_percentage: 47.7,
    three_point_percentage: 41.1,
    main_image: "stephen_curry.webp",
  },
  // More player objects...
];

// Validation function for player data
function validatePlayer(player) {
  const schema = Joi.object({
    name: Joi.string().min(3).max(50).required(),
    team: Joi.string().min(3).max(50).required(),
    position: Joi.string().valid("PG", "SG", "SF", "PF", "C").required(),
    points_per_game: Joi.number().min(0).required(),
    assists_per_game: Joi.number().min(0).required(),
    rebounds_per_game: Joi.number().min(0).required(),
    field_goal_percentage: Joi.number().min(0).max(100).required(),
    three_point_percentage: Joi.number().min(0).max(100).required(),
  });

  return schema.validate(player);
}

// Routes
// Serve the index.html page when visiting the root route
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");  // Serve index.html
});

// Get all players
app.get("/api/players", (req, res) => {
  res.json(players);  // Sends player data as JSON
});

// Add a new player
app.post("/api/players", upload.single("img"), (req, res) => {
  const result = validatePlayer(req.body);

  if (result.error) {
    return res.status(400).send(result.error.details[0].message);
  }

  const player = {
    _id: players.length + 1,
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
    player.main_image = req.file.filename;
  }

  players.push(player);
  res.status(200).send(player);
});

// Update an existing player
app.put("/api/players/:id", upload.single("img"), (req, res) => {
  const player = players.find((p) => p._id === parseInt(req.params.id));

  if (!player) {
    return res.status(404).send("The player with the provided id was not found");
  }

  const result = validatePlayer(req.body);

  if (result.error) {
    return res.status(400).send(result.error.details[0].message);
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
    player.main_image = req.file.filename;
  }

  res.status(200).send(player);
});

// Delete a player
app.delete("/api/players/:id", (req, res) => {
  const playerIndex = players.findIndex((p) => p._id === parseInt(req.params.id));

  if (playerIndex === -1) {
    return res.status(404).send("The player with the provided id was not found");
  }

  const deletedPlayer = players.splice(playerIndex, 1);
  res.status(200).send(deletedPlayer);
});

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
