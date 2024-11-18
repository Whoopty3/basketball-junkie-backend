app.post("/api/players", upload.single("img"), (req, res) => {
  const newPlayer = {
    name: req.body.name,
    team: req.body.team,
    points: req.body.points,
    assists: req.body.assists,
    rebounds: req.body.rebounds,
    fieldGoalPercentage: req.body.fieldGoalPercentage,
    threePointPercentage: req.body.threePointPercentage,
    image: req.file ? req.file.filename : null,
  };

  fs.readFile(playersFilePath, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading players.json:", err);
      return res.status(500).json({ error: "Failed to read players data" });
    }

    const players = JSON.parse(data);
    players.push(newPlayer);

    fs.writeFile(playersFilePath, JSON.stringify(players, null, 2), (err) => {
      if (err) {
        console.error("Error saving player data:", err);
        return res.status(500).json({ error: "Failed to save player data" });
      }
      res.json(newPlayer);
    });
  });
});
