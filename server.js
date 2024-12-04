const express = require("express");
const cors = require("cors");
const multer = require("multer");
const Joi = require("joi");

const app = express();


app.use(cors());
app.use(express.static("public"));
app.use(express.json());


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./public/images/");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });


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
  {
    "id": 3,
    "name": "Kevin Durant",
    "team": "Phoenix Suns",
    "points": 29.2,
    "assists": 5.0,
    "rebounds": 7.0,
    "fieldGoalPercentage": 53.7,
    "threePointPercentage": 37.3
  },
  {
    "id": 4,
    "name": "Giannis Antetokounmpo",
    "team": "Milwaukee Bucks",
    "points": 29.9,
    "assists": 5.9,
    "rebounds": 11.2,
    "fieldGoalPercentage": 55.3,
    "threePointPercentage": 28.6
  },
  {
    "id": 5,
    "name": "Luka Dončić",
    "team": "Dallas Mavericks",
    "points": 32.5,
    "assists": 8.7,
    "rebounds": 9.0,
    "fieldGoalPercentage": 49.0,
    "threePointPercentage": 36.8
  },
  {
    "id": 6,
    "name": "Jayson Tatum",
    "team": "Boston Celtics",
    "points": 28.6,
    "assists": 4.7,
    "rebounds": 8.0,
    "fieldGoalPercentage": 46.8,
    "threePointPercentage": 38.1
  },
  {
    "id": 7,
    "name": "Joel Embiid",
    "team": "Philadelphia 76ers",
    "points": 33.1,
    "assists": 4.2,
    "rebounds": 10.3,
    "fieldGoalPercentage": 54.1,
    "threePointPercentage": 33.0
  },
  {
    "id": 8,
    "name": "Nikola Jokić",
    "team": "Denver Nuggets",
    "points": 24.8,
    "assists": 9.8,
    "rebounds": 11.9,
    "fieldGoalPercentage": 63.2,
    "threePointPercentage": 38.2
  },
  {
    "id": 9,
    "name": "Damian Lillard",
    "team": "Milwaukee Bucks",
    "points": 27.8,
    "assists": 6.3,
    "rebounds": 4.5,
    "fieldGoalPercentage": 45.9,
    "threePointPercentage": 37.8
  },
  {
    "id": 10,
    "name": "Jimmy Butler",
    "team": "Miami Heat",
    "points": 22.9,
    "assists": 5.3,
    "rebounds": 6.3,
    "fieldGoalPercentage": 53.6,
    "threePointPercentage": 35.1
  },
  {
    "id": 11,
    "name": "Ja Morant",
    "team": "Memphis Grizzlies",
    "points": 26.2,
    "assists": 7.4,
    "rebounds": 5.9,
    "fieldGoalPercentage": 46.5,
    "threePointPercentage": 32.8
  },
  {
    "id": 12,
    "name": "Kawhi Leonard",
    "team": "Los Angeles Clippers",
    "points": 25.1,
    "assists": 4.1,
    "rebounds": 6.3,
    "fieldGoalPercentage": 51.3,
    "threePointPercentage": 39.7
  },
  {
    "id": 13,
    "name": "Paul George",
    "team": "Los Angeles Clippers",
    "points": 23.8,
    "assists": 5.1,
    "rebounds": 6.1,
    "fieldGoalPercentage": 47.2,
    "threePointPercentage": 40.3
  },
  {
    "id": 14,
    "name": "Anthony Davis",
    "team": "Los Angeles Lakers",
    "points": 24.5,
    "assists": 2.9,
    "rebounds": 12.3,
    "fieldGoalPercentage": 56.2,
    "threePointPercentage": 29.8
  },
  {
    "id": 15,
    "name": "Zion Williamson",
    "team": "New Orleans Pelicans",
    "points": 25.4,
    "assists": 3.9,
    "rebounds": 7.0,
    "fieldGoalPercentage": 61.1,
    "threePointPercentage": 28.1
  },
  {
    "id": 16,
    "name": "Devin Booker",
    "team": "Phoenix Suns",
    "points": 27.6,
    "assists": 6.3,
    "rebounds": 4.6,
    "fieldGoalPercentage": 48.9,
    "threePointPercentage": 37.2
  },
  {
    "id": 17,
    "name": "Donovan Mitchell",
    "team": "Cleveland Cavaliers",
    "points": 27.4,
    "assists": 4.5,
    "rebounds": 4.2,
    "fieldGoalPercentage": 47.7,
    "threePointPercentage": 38.6
  },
  {
    "id": 18,
    "name": "Shai Gilgeous-Alexander",
    "team": "Oklahoma City Thunder",
    "points": 31.4,
    "assists": 5.6,
    "rebounds": 4.8,
    "fieldGoalPercentage": 51.3,
    "threePointPercentage": 34.5
  },
  {
    "id": 19,
    "name": "Jaylen Brown",
    "team": "Boston Celtics",
    "points": 26.2,
    "assists": 3.4,
    "rebounds": 6.7,
    "fieldGoalPercentage": 49.1,
    "threePointPercentage": 37.3
  },
  {
    "id": 20,
    "name": "Brandon Ingram",
    "team": "New Orleans Pelicans",
    "points": 24.7,
    "assists": 5.5,
    "rebounds": 5.0,
    "fieldGoalPercentage": 48.6,
    "threePointPercentage": 39.2
  },
  {
    "id": 21,
    "name": "Tyrese Haliburton",
    "team": "Indiana Pacers",
    "points": 21.6,
    "assists": 8.7,
    "rebounds": 3.0,
    "fieldGoalPercentage": 46.5,
    "threePointPercentage": 28.4
  },

  {
    "id": 17,
    "name": "Donovan Mitchell",
    "team": "Cleveland Cavaliers",
    "points": 27.4,
    "assists": 4.5,
    "rebounds": 4.2,
    "fieldGoalPercentage": 47.6,
    "threePointPercentage": 38.4
  },
  {
    "id": 18,
    "name": "Karl-Anthony Towns",
    "team": "Minnesota Timberwolves",
    "points": 22.7,
    "assists": 4.1,
    "rebounds": 8.9,
    "fieldGoalPercentage": 49.8,
    "threePointPercentage": 37.5
  },
  {
    "id": 19,
    "name": "Trae Young",
    "team": "Atlanta Hawks",
    "points": 26.2,
    "assists": 9.7,
    "rebounds": 3.1,
    "fieldGoalPercentage": 43.8,
    "threePointPercentage": 34.3
  },
  {
    "id": 20,
    "name": "Shai Gilgeous-Alexander",
    "team": "Oklahoma City Thunder",
    "points": 31.4,
    "assists": 5.5,
    "rebounds": 4.8,
    "fieldGoalPercentage": 51.0,
    "threePointPercentage": 35.5
  },
  {
    "id": 21,
    "name": "De'Aaron Fox",
    "team": "Sacramento Kings",
    "points": 25.5,
    "assists": 6.1,
    "rebounds": 4.2,
    "fieldGoalPercentage": 51.2,
    "threePointPercentage": 32.7
  },
  {
    "id": 22,
    "name": "Brandon Ingram",
    "team": "New Orleans Pelicans",
    "points": 24.7,
    "assists": 5.8,
    "rebounds": 5.5,
    "fieldGoalPercentage": 47.9,
    "threePointPercentage": 39.2
  },
  {
    "id": 23,
    "name": "Jamal Murray",
    "team": "Denver Nuggets",
    "points": 21.1,
    "assists": 6.2,
    "rebounds": 4.0,
    "fieldGoalPercentage": 45.3,
    "threePointPercentage": 38.8
  },
  {
    "id": 24,
    "name": "LaMelo Ball",
    "team": "Charlotte Hornets",
    "points": 23.3,
    "assists": 8.4,
    "rebounds": 6.5,
    "fieldGoalPercentage": 42.6,
    "threePointPercentage": 36.9
  },
  {
    "id": 25,
    "name": "Tyrese Haliburton",
    "team": "Indiana Pacers",
    "points": 20.7,
    "assists": 10.4,
    "rebounds": 3.8,
    "fieldGoalPercentage": 48.5,
    "threePointPercentage": 40.8
  },
  {
    "id": 26,
    "name": "Chris Paul",
    "team": "Golden State Warriors",
    "points": 13.9,
    "assists": 8.9,
    "rebounds": 4.1,
    "fieldGoalPercentage": 44.7,
    "threePointPercentage": 37.6
  },
  {
    "id": 27,
    "name": "Kyrie Irving",
    "team": "Dallas Mavericks",
    "points": 26.0,
    "assists": 5.5,
    "rebounds": 5.1,
    "fieldGoalPercentage": 49.1,
    "threePointPercentage": 39.4
  },
  {
    "id": 28,
    "name": "Pascal Siakam",
    "team": "Toronto Raptors",
    "points": 24.1,
    "assists": 5.8,
    "rebounds": 7.8,
    "fieldGoalPercentage": 48.0,
    "threePointPercentage": 32.5
  },
  {
    "id": 29,
    "name": "Zach LaVine",
    "team": "Chicago Bulls",
    "points": 24.8,
    "assists": 4.2,
    "rebounds": 4.5,
    "fieldGoalPercentage": 48.5,
    "threePointPercentage": 38.3
  },
  {
    "id": 30,
    "name": "Jalen Brunson",
    "team": "New York Knicks",
    "points": 23.8,
    "assists": 6.2,
    "rebounds": 3.5,
    "fieldGoalPercentage": 49.0,
    "threePointPercentage": 41.0
  },
  {
    "id": 31,
    "name": "Darius Garland",
    "team": "Cleveland Cavaliers",
    "points": 21.7,
    "assists": 7.8,
    "rebounds": 2.8,
    "fieldGoalPercentage": 46.2,
    "threePointPercentage": 38.9
  },
  {
    "id": 32,
    "name": "Jaylen Brown",
    "team": "Boston Celtics",
    "points": 26.7,
    "assists": 3.5,
    "rebounds": 6.9,
    "fieldGoalPercentage": 49.2,
    "threePointPercentage": 35.8
  },
  {
    "id": 33,
    "name": "Bam Adebayo",
    "team": "Miami Heat",
    "points": 21.0,
    "assists": 3.3,
    "rebounds": 9.4,
    "fieldGoalPercentage": 54.1,
    "threePointPercentage": 10.0
  },
  {
    "id": 34,
    "name": "CJ McCollum",
    "team": "New Orleans Pelicans",
    "points": 21.9,
    "assists": 5.7,
    "rebounds": 4.4,
    "fieldGoalPercentage": 44.8,
    "threePointPercentage": 38.1
  }
];
app.get("/players", (req, res) => {
  res.json(/api/players);
});

// Edit a player
app.put("/players/:id", (req, res) => {
  const playerId = parseInt(req.params.id);
  const playerIndex = players.findIndex(player => player._id === playerId);

  if (playerIndex === -1) {
    return res.status(404).send("Player not found");
  }

  const updatedPlayer = req.body;


  const schema = Joi.object({
    name: Joi.string().min(3).required(),
    team: Joi.string().min(3).required(),
    position: Joi.string().min(1).required(),
    points_per_game: Joi.number().required(),
    assists_per_game: Joi.number().required(),
    rebounds_per_game: Joi.number().required(),
    field_goal_percentage: Joi.number().required(),
    three_point_percentage: Joi.number().required(),
    main_image: Joi.string().required(),
  });

  const { error } = schema.validate(updatedPlayer);

  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  // Update the player details
  players[playerIndex] = { _id: playerId, ...updatedPlayer };

  res.json(players[playerIndex]);
});

// Delete a player
app.delete("/players/:id", (req, res) => {
  const playerId = parseInt(req.params.id);
  const playerIndex = players.findIndex(player => player._id === playerId);

  if (playerIndex === -1) {
    return res.status(404).send("Player not found");
  }

  // Remove player from the array
  players.splice(playerIndex, 1);

  res.status(200).send("Player deleted successfully");
});

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
