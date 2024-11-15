const express = require("express");
const cors = require("cors");
const app = express();
const Joi = require("joi");
app.use(cors());
app.use(express.json());  // To parse JSON request bodies

const players = [
  {
    id: 1,
    name: "LeBron James",
    team: "Los Angeles Lakers",
    points: 25.0,
    assists: 7.8,
    rebounds: 8.0,
    field_goal_percentage: 50.4,
    three_point_percentage: 30.8,
    image: "lebron.jpg", // Example image file
  },
  {
    id: 2,
    name: "Stephen Curry",
    team: "Golden State Warriors",
    points: 29.9,
    assists: 6.3,
    rebounds: 5.5,
    field_goal_percentage: 48.2,
    three_point_percentage: 41.2,
    image: "curry.jpg", // Example image file
  },
  // Add more players as needed
];

// GET all players
app.get("/api/players", (req, res) => {
  res.json(players);
});

// GET a single player by ID
app.get("/api/players/:id", (req, res) => {
  const player = players.find((p) => p.id === parseInt(req.params.id));
  if (!player) return res.status(404).send("Player not found");
  res.json(player);
});

// POST a new player
app.post("/api/players", (req, res) => {
  const { error } = validatePlayer(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const player = {
    id: players.length + 1, // Simple ID generation logic
    name: req.body.name,
    team: req.body.team,
    points: req.body.points,
    assists: req.body.assists,
    rebounds: req.body.rebounds,
    field_goal_percentage: req.body.field_goal_percentage,
    three_point_percentage: req.body.three_point_percentage,
    image: req.body.image, // For file uploads, you'd save the filename here
  };
  players.push(player);
  res.status(201).send(player);
});

// PUT (Update) an existing player by ID
app.put("/api/players/:id", (req, res) => {
  const player = players.find((p) => p.id === parseInt(req.params.id));
  if (!player) return res.status(404).send("Player not found");

  const { error } = validatePlayer(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  player.name = req.body.name;
  player.team = req.body.team;
  player.points = req.body.points;
  player.assists = req.body.assists;
  player.rebounds = req.body.rebounds;
  player.field_goal_percentage = req.body.field_goal_percentage;
  player.three_point_percentage = req.body.three_point_percentage;
  player.image = req.body.image; // Update image if needed

  res.status(200).send(player);
});

// DELETE a player by ID
app.delete("/api/players/:id", (req, res) => {
  const playerIndex = players.findIndex((p) => p.id === parseInt(req.params.id));
  if (playerIndex === -1) return res.status(404).send("Player not found");

  players.splice(playerIndex, 1);
  res.status(204).send();
});

// Function to validate the player data using Joi
const validatePlayer = (player) => {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
    team: Joi.string().min(3).required(),
    points: Joi.number().required(),
    assists: Joi.number().required(),
    rebounds: Joi.number().required(),
    field_goal_percentage: Joi.number().required(),
    three_point_percentage: Joi.number().required(),
    image: Joi.string(), // Optional field for image file name
  });

  return schema.validate(player);
};

// Serve static files (images, etc.)
app.use(express.static("public"));

// Set up file upload (optional)
const multer = require("multer");
const upload = multer({ dest: "public/images/" }); // Folder for storing uploaded images

// Handle image uploads for players (if you wish to allow this)
app.post("/api/upload", upload.single("image"), (req, res) => {
  if (!req.file) return res.status(400).send("No file uploaded");
  res.send({ file: req.file.filename });
});

// Listen for requests on a specific port
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
