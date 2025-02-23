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

    const newAchievement = await db.collection("achievements").add({
      userID,
      achievementName,
      description: description || "",
      unlockedAt: new Date()
    });

    res.status(201).json({ id: newAchievement.id, message: "Achievement unlocked!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// READ ALL (GET /achievements)
router.get("/", async (req, res) => {
  try {
    const snapshot = await db.collection("achievements").get();
    const achievements = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(achievements);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// READ ONE (GET /achievements/:id)
router.get("/:id", async (req, res) => {
  try {
    const docRef = db.collection("achievements").doc(req.params.id);
    const docSnap = await docRef.get();
    if (!docSnap.exists) {
      return res.status(404).json({ error: "Achievement not found" });
    }
    res.status(200).json({ id: docSnap.id, ...docSnap.data() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// UPDATE (PUT /achievements/:id)
router.put("/:id", async (req, res) => {
  try {
    const { achievementName, description } = req.body;
    const docRef = db.collection("achievements").doc(req.params.id);
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

// DELETE (DELETE /achievements/:id)
router.delete("/:id", async (req, res) => {
  try {
    const docRef = db.collection("achievements").doc(req.params.id);
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
