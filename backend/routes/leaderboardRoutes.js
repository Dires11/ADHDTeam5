const express = require("express");
const router = express.Router();
const db = require("../firebaseConfig");

// CREATE (POST /leaderboard)
router.post("/", async (req, res) => {
  try {
    const { userID, guild, totalPoints, rank } = req.body;
    if (!userID) {
      return res.status(400).json({ error: "Missing userID" });
    }

    const docRef = await db.collection("users")
      .doc(userID)
      .collection("leaderboard")
      .add({
        guild: guild || "None",
        totalPoints: totalPoints || 0,
        rank: rank || "Unranked"
      });

    res.status(201).json({ id: docRef.id, message: "Leaderboard entry created!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// READ ALL (GET /leaderboard?userID=xxx)
router.get("/", async (req, res) => {
  try {
    const { userID } = req.query;
    if (!userID) {
      return res.status(400).json({ error: "Missing userID" });
    }

    const snapshot = await db.collection("users")
      .doc(userID)
      .collection("leaderboard")
      .get();

    const lb = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(lb);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// READ ONE (GET /leaderboard/:entryID?userID=xxx)
router.get("/:entryID", async (req, res) => {
  try {
    const { userID } = req.query;
    const { entryID } = req.params;
    if (!userID || !entryID) {
      return res.status(400).json({ error: "Missing userID or entryID" });
    }

    const docRef = db.collection("users")
      .doc(userID)
      .collection("leaderboard")
      .doc(entryID);

    const docSnap = await docRef.get();
    if (!docSnap.exists) {
      return res.status(404).json({ error: "Entry not found" });
    }
    res.status(200).json({ id: docSnap.id, ...docSnap.data() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// UPDATE (PUT /leaderboard/:entryID?userID=xxx)
router.put("/:entryID", async (req, res) => {
  try {
    const { userID } = req.query;
    const { entryID } = req.params;
    const { guild, totalPoints, rank } = req.body;

    if (!userID || !entryID) {
      return res.status(400).json({ error: "Missing userID or entryID" });
    }

    const docRef = db.collection("users")
      .doc(userID)
      .collection("leaderboard")
      .doc(entryID);

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

// DELETE (DELETE /leaderboard/:entryID?userID=xxx)
router.delete("/:entryID", async (req, res) => {
  try {
    const { userID } = req.query;
    const { entryID } = req.params;

    if (!userID || !entryID) {
      return res.status(400).json({ error: "Missing userID or entryID" });
    }

    const docRef = db.collection("users")
      .doc(userID)
      .collection("leaderboard")
      .doc(entryID);

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
