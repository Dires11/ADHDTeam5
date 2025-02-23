const express = require("express");
const router = express.Router();
const db = require("../firebaseConfig");

// CREATE (POST /streaks)
router.post("/", async (req, res) => {
  try {
    const { userID, streakType } = req.body;
    if (!userID || !streakType) {
      return res.status(400).json({ error: "Missing required fields!" });
    }

    const newStreak = await db.collection("streaks").add({
      userID,
      streakType,
      currentStreak: 1,
      longestStreak: 1,
      lastUpdated: new Date()
    });

    res.status(201).json({ id: newStreak.id, message: "Streak started!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// READ ALL (GET /streaks)
router.get("/", async (req, res) => {
  try {
    const snapshot = await db.collection("streaks").get();
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// READ ONE (GET /streaks/:id)
router.get("/:id", async (req, res) => {
  try {
    const docRef = db.collection("streaks").doc(req.params.id);
    const docSnap = await docRef.get();
    if (!docSnap.exists) {
      return res.status(404).json({ error: "Streak not found" });
    }
    res.status(200).json({ id: docSnap.id, ...docSnap.data() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// UPDATE (PUT /streaks/:id)
router.put("/:id", async (req, res) => {
  try {
    const { currentStreak, longestStreak, streakType } = req.body;
    const docRef = db.collection("streaks").doc(req.params.id);
    const docSnap = await docRef.get();
    if (!docSnap.exists) {
      return res.status(404).json({ error: "Streak not found" });
    }

    await docRef.update({
      ...(currentStreak && { currentStreak }),
      ...(longestStreak && { longestStreak }),
      ...(streakType && { streakType }),
      lastUpdated: new Date()
    });
    res.status(200).json({ message: "Streak updated!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE (DELETE /streaks/:id)
router.delete("/:id", async (req, res) => {
  try {
    const docRef = db.collection("streaks").doc(req.params.id);
    const docSnap = await docRef.get();
    if (!docSnap.exists) {
      return res.status(404).json({ error: "Streak not found" });
    }

    await docRef.delete();
    res.status(200).json({ message: "Streak deleted!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
