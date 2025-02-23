const express = require("express");
const router = express.Router();
const db = require("../firebaseConfig");

// CREATE (POST /leaderboard)
router.post("/", async (req, res) => {
  try {
    const { userID, guild, totalPoints, rank } = req.body;
    if (!userID) {
      return res.status(400).json({ error: "Missing required fields!" });
    }

    const newEntry = await db.collection("leaderboard").add({
      userID,
      guild: guild || "None",
      totalPoints: totalPoints || 0,
      rank: rank || "Unranked"
    });

    res.status(201).json({ id: newEntry.id, message: "Leaderboard entry created!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// READ ALL (GET /leaderboard)
router.get("/", async (req, res) => {
  try {
    const snapshot = await db.collection("leaderboard").get();
    const lb = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(lb);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// READ ONE (GET /leaderboard/:id)
router.get("/:id", async (req, res) => {
  try {
    const docRef = db.collection("leaderboard").doc(req.params.id);
    const docSnap = await docRef.get();
    if (!docSnap.exists) {
      return res.status(404).json({ error: "Entry not found" });
    }
    res.status(200).json({ id: docSnap.id, ...docSnap.data() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// UPDATE (PUT /leaderboard/:id)
router.put("/:id", async (req, res) => {
  try {
    const { guild, totalPoints, rank } = req.body;
    const docRef = db.collection("leaderboard").doc(req.params.id);
    const docSnap = await docRef.get();
    if (!docSnap.exists) {
      return res.status(404).json({ error: "Entry not found" });
    }

    await docRef.update({
      ...(guild && { guild }),
      ...(totalPoints && { totalPoints }),
      ...(rank && { rank })
    });
    res.status(200).json({ message: "Leaderboard entry updated!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE (DELETE /leaderboard/:id)
router.delete("/:id", async (req, res) => {
  try {
    const docRef = db.collection("leaderboard").doc(req.params.id);
    const docSnap = await docRef.get();
    if (!docSnap.exists) {
      return res.status(404).json({ error: "Entry not found" });
    }

    await docRef.delete();
    res.status(200).json({ message: "Leaderboard entry deleted!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
