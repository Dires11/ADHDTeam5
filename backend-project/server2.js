const express = require("express");
const cors = require("cors");

// 1) Initialize the Express App
const app = express();

// 2) Middleware
app.use(express.json());
app.use(cors());

// 3) Import Your Route Files
const userRoutes = require("./routes/userRoutes");
const plannerRoutes = require("./routes/plannerRoutes");
const timerRoutes = require("./routes/timerRoutes");
const competitionRoutes = require("./routes/competitionRoutes");
const talkRoutes = require("./routes/talkRoutes");
const notificationsRoutes = require("./routes/notificationsRoutes");
const streaksRoutes = require("./routes/streaksRoutes");
const toDoRoutes = require("./routes/toDoRoutes");
const achievementsRoutes = require("./routes/achievementsRoutes");
const leaderboardRoutes = require("./routes/leaderboardRoutes");

// ✅ Updated Rewards Route (Handles digital & in-person)
const rewardsRoutes = require("./routes/rewardsRoutes");

// 4) Use Routes
app.use("/users", userRoutes);
app.use("/planner", plannerRoutes);
app.use("/timers", timerRoutes);
app.use("/competitions", competitionRoutes);
app.use("/talk", talkRoutes);
app.use("/notifications", notificationsRoutes);
app.use("/streaks", streaksRoutes);
app.use("/todo", toDoRoutes);
app.use("/achievements", achievementsRoutes);
app.use("/leaderboard", leaderboardRoutes);
app.use("/rewards", rewardsRoutes); // <-- Digital & In-Person Rewards

// 5) Simple Test Route
app.get("/", (req, res) => {
  res.send("🔥 Firebase Backend is Running!");
});

// 6) Start the Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
