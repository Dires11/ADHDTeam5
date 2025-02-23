const express = require("express");
const router = express.Router();
const db = require("../firebaseConfig");

// CREATE (POST /timers)
router.post("/", async (req, res) => {
  try {
    const { userID, startTime, endTime, duration, taskName, category } = req.body;
    if (!userID || !startTime || !endTime || !duration || !taskName || !category) {
      return res.status(400).json({ error: "Missing required fields!" });
    }

    const docRef = await db.collection("users")
      .doc(userID)
      .collection("timers")
      .add({
        startTime,
        endTime,
        duration,
        taskName,
        category
      });

    res.status(201).json({ id: docRef.id, message: "Timer started under user!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// READ ALL (GET /timers?userID=xxx)
router.get("/", async (req, res) => {
  try {
    const { userID } = req.query;
    if (!userID) {
      return res.status(400).json({ error: "Missing userID" });
    }

    const snapshot = await db.collection("users")
      .doc(userID)
      .collection("timers")
      .get();

    const timers = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(timers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// READ ONE (GET /timers/:timerID?userID=xxx)
router.get("/:timerID", async (req, res) => {
  try {
    const { userID } = req.query;
    const { timerID } = req.params;
    if (!userID || !timerID) {
      return res.status(400).json({ error: "Missing userID or timerID" });
    }

    const docRef = db.collection("users")
      .doc(userID)
      .collection("timers")
      .doc(timerID);

    const docSnap = await docRef.get();
    if (!docSnap.exists) {
      return res.status(404).json({ error: "Timer not found" });
    }
    res.status(200).json({ id: docSnap.id, ...docSnap.data() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// UPDATE (PUT /timers/:timerID?userID=xxx)
router.put("/:timerID", async (req, res) => {
  try {
    const { userID } = req.query;
    const { timerID } = req.params;
    const { startTime, endTime, duration, taskName, category } = req.body;

    if (!userID || !timerID) {
      return res.status(400).json({ error: "Missing userID or timerID" });
    }

    const docRef = db.collection("users")
      .doc(userID)
      .collection("timers")
      .doc(timerID);

    const docSnap = await docRef.get();
    if (!docSnap.exists) {
      return res.status(404).json({ error: "Timer not found" });
    }

    await docRef.update({
      ...(startTime && { startTime }),
      ...(endTime && { endTime }),
      ...(duration && { duration }),
      ...(taskName && { taskName }),
      ...(category && { category })
    });
    res.status(200).json({ message: "Timer updated!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE (DELETE /timers/:timerID?userID=xxx)
router.delete("/:timerID", async (req, res) => {
  try {
    const { userID } = req.query;
    const { timerID } = req.params;

    if (!userID || !timerID) {
      return res.status(400).json({ error: "Missing userID or timerID" });
    }

    const docRef = db.collection("users")
      .doc(userID)
      .collection("timers")
      .doc(timerID);

    const docSnap = await docRef.get();
    if (!docSnap.exists) {
      return res.status(404).json({ error: "Timer not found" });
    }

    await docRef.delete();
    res.status(200).json({ message: "Timer deleted!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
