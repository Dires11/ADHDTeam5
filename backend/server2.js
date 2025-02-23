const express = require("express");
const cors = require("cors");

// 1) Initialize the Express App
const app = express();

// 2) Middleware
app.use(express.json());
app.use(cors());

// 3) Import Your Route Files
const betRoutes = require("./routes/betRoutes");
const guildRoutes = require("./routes/guildRoutes");
const userRoutes = require("./routes/userRoutes");
const achievementsRoutes = require("./routes/achievementsRoutes");
const competitionRoutes = require("./routes/competitionRoutes");
const leaderboardRoutes = require("./routes/leaderboardRoutes");
const notificationsRoutes = require("./routes/notificationsRoutes");
const plannerRoutes = require("./routes/plannerRoutes");
const rewardsRoutes = require("./routes/rewardsRoutes");
const streaksRoutes = require("./routes/streaksRoutes");
const talkRoutes = require("./routes/talkRoutes");
const timerRoutes = require("./routes/timerRoutes");
const toDoRoutes = require("./routes/toDoRoutes");

// 4) Use Routes
app.use("/bets",betRoutes);
app.use("/guilds",guildRoutes); 
app.use("/users", userRoutes);
app.use("/achievements", achievementsRoutes);
app.use("/competitions", competitionRoutes);
app.use("/leaderboard", leaderboardRoutes);
app.use("/notifications", notificationsRoutes);
app.use("/planner", plannerRoutes);
app.use("/rewards", rewardsRoutes);
app.use("/streaks", streaksRoutes);
app.use("/talk", talkRoutes);
app.use("/timers", timerRoutes);
app.use("/todo", toDoRoutes);

// 5) Simple Test Route
app.get("/", (req, res) => {
  res.send("🔥 Firebase Backend is Running!");
});

// 6) Start the Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
