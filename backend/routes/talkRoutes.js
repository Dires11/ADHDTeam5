const express = require("express");
const router = express.Router();
const db = require("../firebaseConfig");

// CREATE (POST /talk)
router.post("/", async (req, res) => {
  try {
    const { userID, contactUserID, taskCompletion } = req.body;
    if (!userID || !contactUserID) {
      return res.status(400).json({ error: "Missing required fields!" });
    }

    const docRef = await db.collection("users")
      .doc(userID)
      .collection("talk")
      .add({
        contactUserID,
        taskCompletion: taskCompletion || "",
        createdAt: new Date()
      });

    res.status(201).json({ id: docRef.id, message: "Talk entry created under user!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// READ ALL (GET /talk?userID=xxx)
router.get("/", async (req, res) => {
  try {
    const { userID } = req.query;
    if (!userID) {
      return res.status(400).json({ error: "Missing userID" });
    }

    const snapshot = await db.collection("users")
      .doc(userID)
      .collection("talk")
      .get();

    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// READ ONE (GET /talk/:talkID?userID=xxx)
router.get("/:talkID", async (req, res) => {
  try {
    const { userID } = req.query;
    const { talkID } = req.params;
    if (!userID || !talkID) {
      return res.status(400).json({ error: "Missing userID or talkID" });
    }

    const docRef = db.collection("users")
      .doc(userID)
      .collection("talk")
      .doc(talkID);

    const docSnap = await docRef.get();
    if (!docSnap.exists) {
      return res.status(404).json({ error: "Talk entry not found" });
    }
    res.status(200).json({ id: docSnap.id, ...docSnap.data() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// UPDATE (PUT /talk/:talkID?userID=xxx)
router.put("/:talkID", async (req, res) => {
  try {
    const { userID } = req.query;
    const { talkID } = req.params;
    const { contactUserID, taskCompletion } = req.body;

    if (!userID || !talkID) {
      return res.status(400).json({ error: "Missing userID or talkID" });
    }

    const docRef = db.collection("users")
      .doc(userID)
      .collection("talk")
      .doc(talkID);

    const docSnap = await docRef.get();
    if (!docSnap.exists) {
      return res.status(404).json({ error: "Talk entry not found" });
    }

    await docRef.update({
      ...(contactUserID && { contactUserID }),
      ...(taskCompletion && { taskCompletion })
    });
    res.status(200).json({ message: "Talk entry updated!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE (DELETE /talk/:talkID?userID=xxx)
router.delete("/:talkID", async (req, res) => {
  try {
    const { userID } = req.query;
    const { talkID } = req.params;

    if (!userID || !talkID) {
      return res.status(400).json({ error: "Missing userID or talkID" });
    }

    const docRef = db.collection("users")
      .doc(userID)
      .collection("talk")
      .doc(talkID);

    const docSnap = await docRef.get();
    if (!docSnap.exists) {
      return res.status(404).json({ error: "Talk entry not found" });
    }

    await docRef.delete();
    res.status(200).json({ message: "Talk entry deleted!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
