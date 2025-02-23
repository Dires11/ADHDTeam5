const express = require("express");
const router = express.Router();
const axios = require("axios");
const admin = require("firebase-admin");
const db = require("../firebaseConfig");

// CREATE (POST) a new Bet
//The user will choose a task they will bet on, it will send message to all guild members
router.post("/", async (req, res) => {
  try {
    const { userID, guildID, task, deadline } = req.body;
    if (!userID || !guildID || !task || !deadline) {
      return res.status(400).json({ error: "Missing required fields!" });
    }

    // Retrieve the username of the bet creator
    const userRef = db.collection("users").doc(userID);
    const userSnap = await userRef.get();

    if (!userSnap.exists) {
      return res.status(404).json({ error: "User not found" });
    }

    const username = userSnap.data().username;

    // Create a new bet
    const newBet = await db.collection("bets").add({
      userID,
      guildID,
      task,
      deadline: new Date(deadline),
      bets: [], // Store user responses here
      completed: false,
      createdAt: new Date(),
    });

console.log("Bet created with ID:", newBet.id);


    // Retrieve all members of the guild
    const guildRef = db.collection("guilds").doc(guildID);
    const guildSnap = await guildRef.get();

    if (!guildSnap.exists) {
      return res.status(404).json({ error: "Guild not found" });
    }

    const guildData = guildSnap.data();
    const guildMembers = guildData.members || [];

    // Send an automated message to all members in the guild via talkRoutes.js
    const message = `${username} created a bet that they will complete the task of '${task}'`;

    await Promise.all(guildMembers.map(async (memberID) => {
      try {
        await axios.post("http://localhost:5000/talk", {
          userID: "system",
          contactUserID: memberID,
          taskCompletion: message
        });
      } catch (error) {
        console.error(`Failed to send message to ${memberID}:`, error.message);
      }
    }));

    res.status(201).json({ id: newBet.id, message: "Bet created successfully and messages sent to all guild members!" });
  } catch (error) {
    console.error("Error creating bet:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE (DELETE /bets/:betID)
router.delete("/:betID", async (req, res) => {
    try {
      const { betID } = req.params;
  
      const betRef = db.collection("bets").doc(betID);
      const betSnap = await betRef.get();
  
      if (!betSnap.exists) {
        return res.status(404).json({ error: "Bet not found" });
      }
  
      await betRef.delete();
  
      res.status(200).json({ message: "Bet deleted successfully!" });
    } catch (error) {
      console.error("Error deleting bet:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });
  
  


// ADD RESPONSE TO A BET (POST /bets/:betID/respond)
//this is when each guild member says they believe the person will finish task or not finish task
router.post("/:betID/respond", async (req, res) => {
  try {
    const { betID } = req.params;
    const { userID, belief } = req.body; // belief should be true or false

    if (!userID || typeof belief !== "boolean") {
      return res.status(400).json({ error: "Invalid or missing bet response! Belief must be true or false." });
    }

    const betRef = db.collection("bets").doc(betID);
    const betSnap = await betRef.get();

    if (!betSnap.exists) {
      return res.status(404).json({ error: "Bet not found" });
    }

    const betData = betSnap.data();

    // Prevent the bet creator from responding to their own bet
    if (betData.userID === userID) {
      return res.status(400).json({ error: "You cannot respond to your own bet!" });
    }

    // Check if the user has already responded
    const existingBet = betData.bets.find(bet => bet.userID === userID);
    if (existingBet) {
      return res.status(400).json({ error: "You have already responded to this bet!" });
    }

    // Add the user's response to the bet
    await betRef.update({
      bets: admin.firestore.FieldValue.arrayUnion({
        userID,
        belief, // Store as true or false
        respondedAt: new Date()
      })
    });

    res.status(200).json({ message: "Your response has been recorded!" });
  } catch (error) {
    console.error("Error responding to bet:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// COMPLETE A BET (POST /bets/:betID/complete)
router.post("/:betID/complete", async (req, res) => {
    try {
      const { betID } = req.params;
      const { completed } = req.body; // completed should be true or false
  
      if (typeof completed !== "boolean") {
        return res.status(400).json({ error: "Invalid input! Completion status must be true or false." });
      }
  
      const betRef = db.collection("bets").doc(betID);
      const betSnap = await betRef.get();
  
      if (!betSnap.exists) {
        return res.status(404).json({ error: "Bet not found" });
      }
  
      const betData = betSnap.data();
  
      if (betData.completed) {
        return res.status(400).json({ error: "Bet is already completed!" });
      }
  
      const guildRef = db.collection("guilds").doc(betData.guildID);
      const guildSnap = await guildRef.get();
  
      if (!guildSnap.exists) {
        return res.status(404).json({ error: "Guild not found" });
      }
  
      const guildMembers = guildSnap.data().members || [];
  
      // Prepare points updates and personalized messages
      const pointsUpdates = {};
      const messages = [];
  
      betData.bets.forEach(({ userID, belief }) => {
        let message = "";
        if (completed) {
          if (belief === true) {
            pointsUpdates[userID] = (pointsUpdates[userID] || 0) + 1;
            message = "Bet placed correctly! You earned 1 point.";
          } else {
            pointsUpdates[userID] = (pointsUpdates[userID] || 0) - 1;
            message = "You bet wrong! -1 point.";
          }
        } else {
          if (belief === false) {
            pointsUpdates[userID] = (pointsUpdates[userID] || 0) + 1;
            message = "Bet placed correctly! You earned 1 point.";
          } else {
            pointsUpdates[userID] = (pointsUpdates[userID] || 0) - 1;
            message = "You bet wrong! -1 point.";
          }
        }
        messages.push({ userID, message });
      });
  
      // Update points for all relevant users
      await Promise.all(Object.entries(pointsUpdates).map(async ([userID, pointsChange]) => {
        const userRef = db.collection("users").doc(userID);
        await userRef.update({
          points: admin.firestore.FieldValue.increment(pointsChange)
        });
      }));
  
      // Calculate and update the user's points
      const userPointsChange = completed
        ? betData.bets.filter(bet => bet.belief === false).length
        : -betData.bets.filter(bet => bet.belief === false).length;
  
      await db.collection("users").doc(betData.userID).update({
        points: admin.firestore.FieldValue.increment(userPointsChange)
      });
  
      await betRef.update({
        completed: true,
        completedSuccessfully: completed,
        completedAt: new Date()
      });
  
      // Send personalized messages to guild members
      await Promise.all(messages.map(async ({ userID, message }) => {
        try {
          await axios.post("http://localhost:5000/talk", {
            userID: "system",
            contactUserID: userID,
            taskCompletion: message
          });
        } catch (error) {
          console.error(`Failed to send message to ${userID}:`, error.message);
        }
      }));
  
      // Send a message to the bet creator
      const userMessage = completed
        ? `You earned ${Math.abs(userPointsChange)} points for completing the task!`
        : `You lost ${Math.abs(userPointsChange)} points for not completing the task.`;
  
      await axios.post("http://localhost:5000/talk", {
        userID: "system",
        contactUserID: betData.userID,
        taskCompletion: userMessage
      });
  
      res.status(200).json({ message: "Bet completed and points updated successfully!" });
    } catch (error) {
      console.error("Error completing bet:", error);
      res.status(500).json({ error: "Internal server error" });
    }
  });
  

module.exports = router;
