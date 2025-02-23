const express = require("express");
const router = express.Router();
const db = require("../firebaseConfig");

//-------------------- DIGITAL REWARDS (Under users/{userID}/digital_rewards) --------------------

// CREATE (POST /rewards/digital)
router.post("/digital", async (req, res) => {
  try {
    const { userID, rewardName, pointsRequired, dateEarned, description } = req.body;
    if (!userID || !rewardName || !pointsRequired) {
      return res.status(400).json({ error: "Missing required fields for digital reward!" });
    }

    // Sub-collection path: users/{userID}/digital_rewards
    const docRef = await db.collection("users")
      .doc(userID)
      .collection("digital_rewards")
      .add({
        rewardName,
        pointsRequired,
        dateEarned: dateEarned || null,
        description: description || ""
      });

    // Optionally store the doc ID in the doc itself
    await docRef.update({ digitalRewardID: docRef.id });

    res.status(201).json({ id: docRef.id, message: "Digital reward created under user!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// READ ALL (GET /rewards/digital?userID=xxx)
router.get("/digital", async (req, res) => {
  try {
    const { userID } = req.query;
    if (!userID) {
      return res.status(400).json({ error: "Missing userID in query" });
    }

    const snapshot = await db.collection("users")
      .doc(userID)
      .collection("digital_rewards")
      .get();

    const rewards = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(rewards);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// READ ONE (GET /rewards/digital/:rewardID?userID=xxx)
router.get("/digital/:rewardID", async (req, res) => {
  try {
    const { userID } = req.query;
    const { rewardID } = req.params;

    if (!userID || !rewardID) {
      return res.status(400).json({ error: "Missing userID or rewardID" });
    }

    const docRef = db.collection("users")
      .doc(userID)
      .collection("digital_rewards")
      .doc(rewardID);

    const docSnap = await docRef.get();
    if (!docSnap.exists) {
      return res.status(404).json({ error: "Digital reward not found" });
    }

    res.status(200).json({ id: docSnap.id, ...docSnap.data() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// UPDATE (PUT /rewards/digital/:rewardID?userID=xxx)
router.put("/digital/:rewardID", async (req, res) => {
  try {
    const { userID } = req.query;
    const { rewardID } = req.params;
    const { rewardName, pointsRequired, dateEarned, description } = req.body;

    if (!userID || !rewardID) {
      return res.status(400).json({ error: "Missing userID or rewardID" });
    }

    const docRef = db.collection("users")
      .doc(userID)
      .collection("digital_rewards")
      .doc(rewardID);

    const docSnap = await docRef.get();
    if (!docSnap.exists) {
      return res.status(404).json({ error: "Digital reward not found" });
    }

    await docRef.update({
      ...(rewardName && { rewardName }),
      ...(pointsRequired && { pointsRequired }),
      ...(dateEarned && { dateEarned }),
      ...(description && { description })
    });

    res.status(200).json({ message: "Digital reward updated!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE (DELETE /rewards/digital/:rewardID?userID=xxx)
router.delete("/digital/:rewardID", async (req, res) => {
  try {
    const { userID } = req.query;
    const { rewardID } = req.params;

    if (!userID || !rewardID) {
      return res.status(400).json({ error: "Missing userID or rewardID" });
    }

    const docRef = db.collection("users")
      .doc(userID)
      .collection("digital_rewards")
      .doc(rewardID);

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

//-------------------- IN-PERSON REWARDS (Under users/{userID}/inperson_rewards) --------------------

// CREATE (POST /rewards/inperson)
router.post("/inperson", async (req, res) => {
  try {
    const { userID, rewardName, pointsRequired, dateEarned, description } = req.body;
    if (!userID || !rewardName || !pointsRequired) {
      return res.status(400).json({ error: "Missing required fields for in-person reward!" });
    }

    const docRef = await db.collection("users")
      .doc(userID)
      .collection("inperson_rewards")
      .add({
        rewardName,
        pointsRequired,
        dateEarned: dateEarned || null,
        description: description || ""
      });

    await docRef.update({ inPersonRewardID: docRef.id });

    res.status(201).json({ id: docRef.id, message: "In-person reward created under user!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// READ ALL (GET /rewards/inperson?userID=xxx)
router.get("/inperson", async (req, res) => {
  try {
    const { userID } = req.query;
    if (!userID) {
      return res.status(400).json({ error: "Missing userID in query" });
    }

    const snapshot = await db.collection("users")
      .doc(userID)
      .collection("inperson_rewards")
      .get();

    const rewards = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(rewards);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// READ ONE (GET /rewards/inperson/:rewardID?userID=xxx)
router.get("/inperson/:rewardID", async (req, res) => {
  try {
    const { userID } = req.query;
    const { rewardID } = req.params;

    if (!userID || !rewardID) {
      return res.status(400).json({ error: "Missing userID or rewardID" });
    }

    const docRef = db.collection("users")
      .doc(userID)
      .collection("inperson_rewards")
      .doc(rewardID);

    const docSnap = await docRef.get();
    if (!docSnap.exists) {
      return res.status(404).json({ error: "In-person reward not found" });
    }

    res.status(200).json({ id: docSnap.id, ...docSnap.data() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// UPDATE (PUT /rewards/inperson/:rewardID?userID=xxx)
router.put("/inperson/:rewardID", async (req, res) => {
  try {
    const { userID } = req.query;
    const { rewardID } = req.params;
    const { rewardName, pointsRequired, dateEarned, description } = req.body;

    if (!userID || !rewardID) {
      return res.status(400).json({ error: "Missing userID or rewardID" });
    }

    const docRef = db.collection("users")
      .doc(userID)
      .collection("inperson_rewards")
      .doc(rewardID);

    const docSnap = await docRef.get();
    if (!docSnap.exists) {
      return res.status(404).json({ error: "In-person reward not found" });
    }

    await docRef.update({
      ...(rewardName && { rewardName }),
      ...(pointsRequired && { pointsRequired }),
      ...(dateEarned && { dateEarned }),
      ...(description && { description })
    });

    res.status(200).json({ message: "In-person reward updated!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE (DELETE /rewards/inperson/:rewardID?userID=xxx)
router.delete("/inperson/:rewardID", async (req, res) => {
  try {
    const { userID } = req.query;
    const { rewardID } = req.params;

    if (!userID || !rewardID) {
      return res.status(400).json({ error: "Missing userID or rewardID" });
    }

    const docRef = db.collection("users")
      .doc(userID)
      .collection("inperson_rewards")
      .doc(rewardID);

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
