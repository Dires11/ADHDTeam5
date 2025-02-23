const express = require("express");
const router = express.Router();
const db = require("../firebaseConfig");

// CREATE (POST /notifications)
router.post("/", async (req, res) => {
  try {
    const { userID, type, message, status, relatedID } = req.body;
    if (!userID || !type || !message) {
      return res.status(400).json({ error: "Missing required fields!" });
    }

    const docRef = await db.collection("users")
      .doc(userID)
      .collection("notifications")
      .add({
        type,
        message,
        status: status || "Unread",
        relatedID: relatedID || null,
        createdAt: new Date(),
        seenAt: null
      });

    res.status(201).json({ id: docRef.id, message: "Notification created under user!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// READ ALL (GET /notifications?userID=xxx)
router.get("/", async (req, res) => {
  try {
    const { userID } = req.query;
    if (!userID) {
      return res.status(400).json({ error: "Missing userID in query" });
    }

    const snapshot = await db.collection("users")
      .doc(userID)
      .collection("notifications")
      .get();

    const notifs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(notifs);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// READ ONE (GET /notifications/:notificationID?userID=xxx)
router.get("/:notificationID", async (req, res) => {
  try {
    const { userID } = req.query;
    const { notificationID } = req.params;
    if (!userID || !notificationID) {
      return res.status(400).json({ error: "Missing userID or notificationID" });
    }

    const docRef = db.collection("users")
      .doc(userID)
      .collection("notifications")
      .doc(notificationID);

    const docSnap = await docRef.get();
    if (!docSnap.exists) {
      return res.status(404).json({ error: "Notification not found" });
    }

    res.status(200).json({ id: docSnap.id, ...docSnap.data() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// UPDATE (PUT /notifications/:notificationID?userID=xxx)
router.put("/:notificationID", async (req, res) => {
  try {
    const { userID } = req.query;
    const { notificationID } = req.params;
    const { type, message, status, relatedID, seenAt } = req.body;

    if (!userID || !notificationID) {
      return res.status(400).json({ error: "Missing userID or notificationID" });
    }

    const docRef = db.collection("users")
      .doc(userID)
      .collection("notifications")
      .doc(notificationID);

    const docSnap = await docRef.get();
    if (!docSnap.exists) {
      return res.status(404).json({ error: "Notification not found" });
    }

    await docRef.update({
      ...(type && { type }),
      ...(message && { message }),
      ...(status && { status }),
      ...(relatedID && { relatedID }),
      ...(seenAt && { seenAt })
    });
    res.status(200).json({ message: "Notification updated!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE (DELETE /notifications/:notificationID?userID=xxx)
router.delete("/:notificationID", async (req, res) => {
  try {
    const { userID } = req.query;
    const { notificationID } = req.params;

    if (!userID || !notificationID) {
      return res.status(400).json({ error: "Missing userID or notificationID" });
    }

    const docRef = db.collection("users")
      .doc(userID)
      .collection("notifications")
      .doc(notificationID);

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
