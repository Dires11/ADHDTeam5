const express = require("express");
const router = express.Router();
const db = require("../firebaseConfig");

// CREATE (POST /competitions)
router.post("/", async (req, res) => {
  try {
    const { userID, competitionName, competitionType, score, rank } = req.body;
    if (!userID || !competitionName || !competitionType) {
      return res.status(400).json({ error: "Missing required fields!" });
    }

    const newCompetition = await db.collection("competitions").add({
      userID,
      competitionName,
      competitionType,
      score: score || 0,
      rank: rank || "Unranked",
      dateParticipated: new Date()
    });

    res.status(201).json({ id: newCompetition.id, message: "Competition created!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// READ ALL (GET /competitions)
router.get("/", async (req, res) => {
  try {
    const snapshot = await db.collection("competitions").get();
    const comps = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(comps);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// READ ONE (GET /competitions/:id)
router.get("/:id", async (req, res) => {
  try {
    const docRef = db.collection("competitions").doc(req.params.id);
    const docSnap = await docRef.get();
    if (!docSnap.exists) {
      return res.status(404).json({ error: "Competition not found" });
    }
    res.status(200).json({ id: docSnap.id, ...docSnap.data() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// UPDATE (PUT /competitions/:id)
router.put("/:id", async (req, res) => {
  try {
    const { competitionName, competitionType, score, rank } = req.body;
    const docRef = db.collection("competitions").doc(req.params.id);
    const docSnap = await docRef.get();
    if (!docSnap.exists) {
      return res.status(404).json({ error: "Competition not found" });
    }

    await docRef.update({
      ...(competitionName && { competitionName }),
      ...(competitionType && { competitionType }),
      ...(score && { score }),
      ...(rank && { rank })
    });
    res.status(200).json({ message: "Competition updated!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE (DELETE /competitions/:id)
router.delete("/:id", async (req, res) => {
  try {
    const docRef = db.collection("competitions").doc(req.params.id);
    const docSnap = await docRef.get();
    if (!docSnap.exists) {
      return res.status(404).json({ error: "Competition not found" });
    }

    await docRef.delete();
    res.status(200).json({ message: "Competition deleted!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
