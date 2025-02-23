const express = require("express");
const router = express.Router();
const db = require("../firebaseConfig");

// CREATE (POST /achievements)
router.post("/", async (req, res) => {
  try {
    const { userID, achievementName, description } = req.body;
    if (!userID || !achievementName) {
      return res.status(400).json({ error: "Missing required fields!" });
    }

    const docRef = await db.collection("users")
      .doc(userID)
      .collection("achievements")
      .add({
        achievementName,
        description: description || "",
        unlockedAt: new Date()
      });

    res.status(201).json({ id: docRef.id, message: "Achievement unlocked!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// READ ALL (GET /achievements?userID=xxx)
router.get("/", async (req, res) => {
  try {
    const { userID } = req.query;
    if (!userID) {
      return res.status(400).json({ error: "Missing userID" });
    }

    const snapshot = await db.collection("users")
      .doc(userID)
      .collection("achievements")
      .get();

    const achievements = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(achievements);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// READ ONE (GET /achievements/:achievementID?userID=xxx)
router.get("/:achievementID", async (req, res) => {
  try {
    const { userID } = req.query;
    const { achievementID } = req.params;
    if (!userID || !achievementID) {
      return res.status(400).json({ error: "Missing userID or achievementID" });
    }

    const docRef = db.collection("users")
      .doc(userID)
      .collection("achievements")
      .doc(achievementID);

    const docSnap = await docRef.get();
    if (!docSnap.exists) {
      return res.status(404).json({ error: "Achievement not found" });
    }

    res.status(200).json({ id: docSnap.id, ...docSnap.data() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// UPDATE (PUT /achievements/:achievementID?userID=xxx)
router.put("/:achievementID", async (req, res) => {
  try {
    const { userID } = req.query;
    const { achievementID } = req.params;
    const { achievementName, description } = req.body;

    if (!userID || !achievementID) {
      return res.status(400).json({ error: "Missing userID or achievementID" });
    }

    const docRef = db.collection("users")
      .doc(userID)
      .collection("achievements")
      .doc(achievementID);

    const docSnap = await docRef.get();
    if (!docSnap.exists) {
      return res.status(404).json({ error: "Achievement not found" });
    }

    await docRef.update({
      ...(achievementName && { achievementName }),
      ...(description && { description })
    });
    res.status(200).json({ message: "Achievement updated!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE (DELETE /achievements/:achievementID?userID=xxx)
router.delete("/:achievementID", async (req, res) => {
  try {
    const { userID } = req.query;
    const { achievementID } = req.params;

    if (!userID || !achievementID) {
      return res.status(400).json({ error: "Missing userID or achievementID" });
    }

    const docRef = db.collection("users")
      .doc(userID)
      .collection("achievements")
      .doc(achievementID);

    const docSnap = await docRef.get();
    if (!docSnap.exists) {
      return res.status(404).json({ error: "Achievement not found" });
    }

    await docRef.delete();
    res.status(200).json({ message: "Achievement deleted!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
