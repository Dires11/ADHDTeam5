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

    const docRef = await db.collection("users")
      .doc(userID)
      .collection("streaks")
      .add({
        streakType,
        currentStreak: 1,
        longestStreak: 1,
        lastUpdated: new Date(),
        resetDate: null,
        lastActivityType: null
      });

    res.status(201).json({ id: docRef.id, message: "Streak started under user!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// READ ALL (GET /streaks?userID=xxx)
router.get("/", async (req, res) => {
  try {
    const { userID } = req.query;
    if (!userID) {
      return res.status(400).json({ error: "Missing userID" });
    }

    const snapshot = await db.collection("users")
      .doc(userID)
      .collection("streaks")
      .get();

    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// READ ONE (GET /streaks/:streakID?userID=xxx)
router.get("/:streakID", async (req, res) => {
  try {
    const { userID } = req.query;
    const { streakID } = req.params;
    if (!userID || !streakID) {
      return res.status(400).json({ error: "Missing userID or streakID" });
    }

    const docRef = db.collection("users")
      .doc(userID)
      .collection("streaks")
      .doc(streakID);

    const docSnap = await docRef.get();
    if (!docSnap.exists) {
      return res.status(404).json({ error: "Streak not found" });
    }

    res.status(200).json({ id: docSnap.id, ...docSnap.data() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// UPDATE (PUT /streaks/:streakID?userID=xxx)
router.put("/:streakID", async (req, res) => {
  try {
    const { userID } = req.query;
    const { streakID } = req.params;
    const { currentStreak, longestStreak, streakType, resetDate, lastActivityType } = req.body;

    if (!userID || !streakID) {
      return res.status(400).json({ error: "Missing userID or streakID" });
    }

    const docRef = db.collection("users")
      .doc(userID)
      .collection("streaks")
      .doc(streakID);

    const docSnap = await docRef.get();
    if (!docSnap.exists) {
      return res.status(404).json({ error: "Streak not found" });
    }

    await docRef.update({
      ...(currentStreak && { currentStreak }),
      ...(longestStreak && { longestStreak }),
      ...(streakType && { streakType }),
      ...(resetDate && { resetDate }),
      ...(lastActivityType && { lastActivityType }),
      lastUpdated: new Date()
    });
    res.status(200).json({ message: "Streak updated!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE (DELETE /streaks/:streakID?userID=xxx)
router.delete("/:streakID", async (req, res) => {
  try {
    const { userID } = req.query;
    const { streakID } = req.params;

    if (!userID || !streakID) {
      return res.status(400).json({ error: "Missing userID or streakID" });
    }

    const docRef = db.collection("users")
      .doc(userID)
      .collection("streaks")
      .doc(streakID);

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
