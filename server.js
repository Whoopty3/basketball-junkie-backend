const express = require("express");
const cors = require("cors");
const multer = require("multer");
const fs = require("fs");
const path = require("path");
const Joi = require("joi");

const app = express();

// Middleware for parsing JSON bodies
app.use(express.json());

// Configure CORS to allow all localhost ports and specific deployed URLs
const corsOptions = {
  origin: [
    /^http:\/\/localhost:\d+$/, // Allow all localhost ports
    "https://whoopty3.github.io", // Deployed frontend URL
    "https://whoopty3.github.io/basketball-junkie-react", // Specific subpage
  ],
};
app.use(cors(corsOptions));

// Serve static files (like images) from the "public" directory
app.use(express.static("public"));

// Configure multer for image uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = "./public/images/";
    if (!fs.existsSync(uploadPath)) {
      fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname); // Save file with its original name
  },
});
const upload = multer({ storage });

// Path to the players.json file
const playersFilePath = path.join(__dirname, "players.json");

// Utility function to read players.json
const readPlayersFile = () =>
  new Promise((resolve, reject) => {
    fs.readFile(playersFilePath, "utf8", (err, data) => {
      if (err) reject(err);
      try {
        resolve(JSON.parse(data));
      } catch (parseError) {
        reject(parseError);
      }
    });
  });

// Utility function to write to players.json
const writePlayersFile = (data) =>
  new Promise((resolve, reject) => {
    fs.writeFile(playersFilePath, JSON.stringify(data, null, 2), "utf8", (err) => {
      if (err) reject(err);
      resolve();
    });
  });

// Endpoint to serve players.json data at the root URL
app.get("/", async (req, res) => {
  try {
    const players = await readPlayersFile();
    res.json(players);
  } catch (err) {
    console.error("Error loading players:", err);
    res.status(500).json({ error: "Failed to load players data" });
  }
});

// Endpoint to serve players data at /api/players
app.get("/api/players", async (req, res) => {
  try {
    const players = await readPlayersFile();
    res.json(players);
  } catch (err) {
    console.error("Error loading players:", err);
    res.status(500).json({ error: "Failed to load players data" });
  }
});

// POST endpoint to add a new player
app.post("/api/players", upload.single("img"), async (req, res) => {
  // Validate input data
  const result = validatePlayer(req.body);
  if (result.error) {
    return res.status(400).json({ error: result.error.details[0].message });
  }

  const newPlayer = {
    name: req.body.name,
    team: req.body.team,
    points: parseFloat(req.body.points),
    assists: parseFloat(req.body.assists),
    rebounds: parseFloat(req.body.rebounds),
    fieldGoalPercentage: parseFloat(req.body.fieldGoalPercentage),
    threePointPercentage: parseFloat(req.body.threePointPercentage),
    image: req.file ? `/images/${req.file.filename}` : null, // Include image path if uploaded
  };

  try {
    const players = await readPlayersFile();
    players.push(newPlayer);
    await writePlayersFile(players);
    res.status(201).json(newPlayer);
  } catch (err) {
    console.error("Error saving player:", err);
    res.status(500).json({ error: "Failed to save player data" });
  }
});

// Validation schema for player data
const validatePlayer = (player) => {
  const schema = Joi.object({
    name: Joi.string().min(3).required(),
    team: Joi.string().min(3).required(),
    points: Joi.number().positive().required(),
    assists: Joi.number().positive().required(),
    rebounds: Joi.number().positive().required(),
    fieldGoalPercentage: Joi.number().positive().required(),
    threePointPercentage: Joi.number().positive().required(),
  });

  return schema.validate(player);
};

// Start the server
const port = process.env.PORT || 3001;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
