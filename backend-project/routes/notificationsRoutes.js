const express = require("express");
const router = express.Router();
const db = require("../firebaseConfig");

// CREATE (POST /notifications)
router.post("/", async (req, res) => {
  try {
    const { userID, type, message, relatedID } = req.body;
    if (!userID || !type || !message) {
      return res.status(400).json({ error: "Missing required fields!" });
    }

    const newNotif = await db.collection("notifications").add({
      userID,
      type,
      message,
      relatedID: relatedID || null,
      status: "Unread",
      createdAt: new Date()
    });

    res.status(201).json({ id: newNotif.id, message: "Notification created!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// READ ALL (GET /notifications)
router.get("/", async (req, res) => {
  try {
    const snapshot = await db.collection("notifications").get();
    const notifs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(notifs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// READ ONE (GET /notifications/:id)
router.get("/:id", async (req, res) => {
  try {
    const docRef = db.collection("notifications").doc(req.params.id);
    const docSnap = await docRef.get();
    if (!docSnap.exists) {
      return res.status(404).json({ error: "Notification not found" });
    }
    res.status(200).json({ id: docSnap.id, ...docSnap.data() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// UPDATE (PUT /notifications/:id)
router.put("/:id", async (req, res) => {
  try {
    const { type, message, relatedID, status } = req.body;
    const docRef = db.collection("notifications").doc(req.params.id);
    const docSnap = await docRef.get();
    if (!docSnap.exists) {
      return res.status(404).json({ error: "Notification not found" });
    }

    await docRef.update({
      ...(type && { type }),
      ...(message && { message }),
      ...(relatedID && { relatedID }),
      ...(status && { status })
    });
    res.status(200).json({ message: "Notification updated!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE (DELETE /notifications/:id)
router.delete("/:id", async (req, res) => {
  try {
    const docRef = db.collection("notifications").doc(req.params.id);
    const docSnap = await docRef.get();
    if (!docSnap.exists) {
      return res.status(404).json({ error: "Notification not found" });
    }

    await docRef.delete();
    res.status(200).json({ message: "Notification deleted!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
