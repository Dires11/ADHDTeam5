const express = require("express");
const router = express.Router();
const db = require("../firebaseConfig");

//-------------------- DIGITAL REWARDS --------------------

// CREATE (POST /rewards/digital)
router.post("/digital", async (req, res) => {
  try {
    const { userID, digitalRewardName, pointsRequired, dateEarned, redeemedAt } = req.body;
    if (!userID || !digitalRewardName || !pointsRequired) {
      return res.status(400).json({ error: "Missing required fields for digital reward!" });
    }

    const docRef = await db.collection("digital_rewards").add({
      userID,
      digitalRewardName,
      pointsRequired,
      dateEarned: dateEarned || null,
      redeemedAt: redeemedAt || null
    });
    await docRef.update({ digitalRewardID: docRef.id });

    res.status(201).json({ id: docRef.id, message: "Digital reward created!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// READ ALL (GET /rewards/digital)
router.get("/digital", async (req, res) => {
  try {
    const snapshot = await db.collection("digital_rewards").get();
    const rewards = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(rewards);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// READ ONE (GET /rewards/digital/:id)
router.get("/digital/:id", async (req, res) => {
  try {
    const docRef = db.collection("digital_rewards").doc(req.params.id);
    const docSnap = await docRef.get();
    if (!docSnap.exists) {
      return res.status(404).json({ error: "Digital reward not found" });
    }

    res.status(200).json({ id: docSnap.id, ...docSnap.data() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// UPDATE (PUT /rewards/digital/:id)
router.put("/digital/:id", async (req, res) => {
  try {
    const { digitalRewardName, pointsRequired, dateEarned, redeemedAt } = req.body;
    const docRef = db.collection("digital_rewards").doc(req.params.id);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return res.status(404).json({ error: "Digital reward not found" });
    }

    await docRef.update({
      ...(digitalRewardName && { digitalRewardName }),
      ...(pointsRequired && { pointsRequired }),
      ...(dateEarned && { dateEarned }),
      ...(redeemedAt && { redeemedAt })
    });

    res.status(200).json({ message: "Digital reward updated!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE (DELETE /rewards/digital/:id)
router.delete("/digital/:id", async (req, res) => {
  try {
    const docRef = db.collection("digital_rewards").doc(req.params.id);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return res.status(404).json({ error: "Digital reward not found" });
    }

    await docRef.delete();
    res.status(200).json({ message: "Digital reward deleted!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//-------------------- IN-PERSON REWARDS --------------------

// CREATE (POST /rewards/inperson)
router.post("/inperson", async (req, res) => {
  try {
    const { userID, inPersonRewardName, pointsRequired, dateEarned } = req.body;
    if (!userID || !inPersonRewardName || !pointsRequired) {
      return res.status(400).json({ error: "Missing required fields for in-person reward!" });
    }

    const docRef = await db.collection("inperson_rewards").add({
      userID,
      inPersonRewardName,
      pointsRequired,
      dateEarned: dateEarned || null
    });
    await docRef.update({ inPersonRewardID: docRef.id });

    res.status(201).json({ id: docRef.id, message: "In-person reward created!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// READ ALL (GET /rewards/inperson)
router.get("/inperson", async (req, res) => {
  try {
    const snapshot = await db.collection("inperson_rewards").get();
    const rewards = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(rewards);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// READ ONE (GET /rewards/inperson/:id)
router.get("/inperson/:id", async (req, res) => {
  try {
    const docRef = db.collection("inperson_rewards").doc(req.params.id);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return res.status(404).json({ error: "In-person reward not found" });
    }

    res.status(200).json({ id: docSnap.id, ...docSnap.data() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// UPDATE (PUT /rewards/inperson/:id)
router.put("/inperson/:id", async (req, res) => {
  try {
    const { inPersonRewardName, pointsRequired, dateEarned } = req.body;
    const docRef = db.collection("inperson_rewards").doc(req.params.id);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return res.status(404).json({ error: "In-person reward not found" });
    }

    await docRef.update({
      ...(inPersonRewardName && { inPersonRewardName }),
      ...(pointsRequired && { pointsRequired }),
      ...(dateEarned && { dateEarned })
    });

    res.status(200).json({ message: "In-person reward updated!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE (DELETE /rewards/inperson/:id)
router.delete("/inperson/:id", async (req, res) => {
  try {
    const docRef = db.collection("inperson_rewards").doc(req.params.id);
    const docSnap = await docRef.get();

    if (!docSnap.exists) {
      return res.status(404).json({ error: "In-person reward not found" });
    }

    await docRef.delete();
    res.status(200).json({ message: "In-person reward deleted!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
