const express = require("express");
const router = express.Router();
const db = require("../firebaseConfig"); // Ensure correct path to your firebaseConfig.js

//---------------------------------------------------
//  DIGITAL REWARDS
//---------------------------------------------------

/**
 * CREATE a Digital Reward (POST /rewards/digital)
 * JSON Body:
 * {
 *   "userID": "User123",
 *   "digitalRewardName": "Amazon Gift Card",
 *   "pointsRequired": 500,
 *   "dateEarned": "2025-03-01T10:00:00Z",  // optional
 *   "redeemedAt": null                    // optional
 * }
 */
router.post("/digital", async (req, res) => {
  try {
    const { userID, digitalRewardName, pointsRequired, dateEarned, redeemedAt } = req.body;
    if (!userID || !digitalRewardName || !pointsRequired) {
      return res.status(400).json({ error: "Missing required fields for digital reward!" });
    }

    // Create document in "digital_rewards"
    const docRef = await db.collection("digital_rewards").add({
      userID,
      digitalRewardName,
      pointsRequired,
      dateEarned: dateEarned || null,
      redeemedAt: redeemedAt || null
    });

    // Store Firestore doc ID in "digitalRewardID"
    await docRef.update({ digitalRewardID: docRef.id });

    res.status(201).json({ id: docRef.id, message: "Digital reward created!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * READ ALL Digital Rewards (GET /rewards/digital)
 */
router.get("/digital", async (req, res) => {
  try {
    const snapshot = await db.collection("digital_rewards").get();
    const rewards = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(rewards);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * READ ONE Digital Reward by ID (GET /rewards/digital/:docID)
 */
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

/**
 * UPDATE a Digital Reward (PUT /rewards/digital/:docID)
 * JSON Body can include any of:
 * {
 *   "digitalRewardName": "New Name",
 *   "pointsRequired": 999,
 *   "dateEarned": "2025-03-02T12:00:00Z",
 *   "redeemedAt": "2025-03-03T09:00:00Z"
 * }
 */
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

/**
 * DELETE a Digital Reward (DELETE /rewards/digital/:docID)
 */
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

//---------------------------------------------------
//  IN-PERSON REWARDS
//---------------------------------------------------

/**
 * CREATE an In-Person Reward (POST /rewards/inperson)
 * JSON Body:
 * {
 *   "userID": "User123",
 *   "inPersonRewardName": "Free Coffee",
 *   "pointsRequired": 100,
 *   "dateEarned": "2025-03-01T10:00:00Z"  // optional
 * }
 */
router.post("/inperson", async (req, res) => {
  try {
    const { userID, inPersonRewardName, pointsRequired, dateEarned } = req.body;
    if (!userID || !inPersonRewardName || !pointsRequired) {
      return res.status(400).json({ error: "Missing required fields for in-person reward!" });
    }

    // Create document in "inperson_rewards"
    const docRef = await db.collection("inperson_rewards").add({
      userID,
      inPersonRewardName,
      pointsRequired,
      dateEarned: dateEarned || null
    });

    // Store Firestore doc ID in "inPersonRewardID"
    await docRef.update({ inPersonRewardID: docRef.id });

    res.status(201).json({ id: docRef.id, message: "In-person reward created!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * READ ALL In-Person Rewards (GET /rewards/inperson)
 */
router.get("/inperson", async (req, res) => {
  try {
    const snapshot = await db.collection("inperson_rewards").get();
    const rewards = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(rewards);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

/**
 * READ ONE In-Person Reward by ID (GET /rewards/inperson/:docID)
 */
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

/**
 * UPDATE an In-Person Reward (PUT /rewards/inperson/:docID)
 * JSON Body can include any of:
 * {
 *   "inPersonRewardName": "New Name",
 *   "pointsRequired": 200,
 *   "dateEarned": "2025-03-02T12:00:00Z"
 * }
 */
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

/**
 * DELETE an In-Person Reward (DELETE /rewards/inperson/:docID)
 */
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
