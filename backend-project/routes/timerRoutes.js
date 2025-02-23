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

    const newTimer = await db.collection("timers").add({
      userID,
      startTime,
      endTime,
      duration,
      taskName,
      category
    });

    res.status(201).json({ id: newTimer.id, message: "Timer started!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// READ ALL (GET /timers)
router.get("/", async (req, res) => {
  try {
    const snapshot = await db.collection("timers").get();
    const timers = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(timers);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// READ ONE (GET /timers/:id)
router.get("/:id", async (req, res) => {
  try {
    const timerRef = db.collection("timers").doc(req.params.id);
    const timerDoc = await timerRef.get();
    if (!timerDoc.exists) {
      return res.status(404).json({ error: "Timer not found" });
    }
    res.status(200).json({ id: timerDoc.id, ...timerDoc.data() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// UPDATE (PUT /timers/:id)
router.put("/:id", async (req, res) => {
  try {
    const { startTime, endTime, duration, taskName, category } = req.body;
    const timerRef = db.collection("timers").doc(req.params.id);
    const timerDoc = await timerRef.get();
    if (!timerDoc.exists) {
      return res.status(404).json({ error: "Timer not found" });
    }

    await timerRef.update({
      ...(startTime && { startTime }),
      ...(endTime && { endTime }),
      ...(duration && { duration }),
      ...(taskName && { taskName }),
      ...(category && { category })
    });

    res.status(200).json({ message: "Timer updated successfully!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE (DELETE /timers/:id)
router.delete("/:id", async (req, res) => {
  try {
    const timerRef = db.collection("timers").doc(req.params.id);
    const timerDoc = await timerRef.get();
    if (!timerDoc.exists) {
      return res.status(404).json({ error: "Timer not found" });
    }

    await timerRef.delete();
    res.status(200).json({ message: "Timer deleted successfully!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
