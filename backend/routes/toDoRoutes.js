const express = require("express");
const router = express.Router();
const db = require("../firebaseConfig");

// CREATE (POST /todo)
router.post("/", async (req, res) => {
  try {
    const { userID, taskName, priority, dueDate, status } = req.body;
    if (!userID || !taskName) {
      return res.status(400).json({ error: "Missing required fields!" });
    }

    const docRef = await db.collection("users")
      .doc(userID)
      .collection("todo")
      .add({
        taskName,
        priority: priority || "Medium",
        dueDate: dueDate || null,
        status: status || "Pending",
        createdAt: new Date()
      });

    res.status(201).json({ id: docRef.id, message: "To-do item created under user!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// READ ALL (GET /todo?userID=xxx)
router.get("/", async (req, res) => {
  try {
    const { userID } = req.query;
    if (!userID) {
      return res.status(400).json({ error: "Missing userID" });
    }

    const snapshot = await db.collection("users")
      .doc(userID)
      .collection("todo")
      .get();

    const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// READ ONE (GET /todo/:todoID?userID=xxx)
router.get("/:todoID", async (req, res) => {
  try {
    const { userID } = req.query;
    const { todoID } = req.params;
    if (!userID || !todoID) {
      return res.status(400).json({ error: "Missing userID or todoID" });
    }

    const docRef = db.collection("users")
      .doc(userID)
      .collection("todo")
      .doc(todoID);

    const docSnap = await docRef.get();
    if (!docSnap.exists) {
      return res.status(404).json({ error: "To-do item not found" });
    }
    res.status(200).json({ id: docSnap.id, ...docSnap.data() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// UPDATE (PUT /todo/:todoID?userID=xxx)
router.put("/:todoID", async (req, res) => {
  try {
    const { userID } = req.query;
    const { todoID } = req.params;
    const { taskName, priority, dueDate, status } = req.body;

    if (!userID || !todoID) {
      return res.status(400).json({ error: "Missing userID or todoID" });
    }

    const docRef = db.collection("users")
      .doc(userID)
      .collection("todo")
      .doc(todoID);

    const docSnap = await docRef.get();
    if (!docSnap.exists) {
      return res.status(404).json({ error: "To-do item not found" });
    }

    await docRef.update({
      ...(taskName && { taskName }),
      ...(priority && { priority }),
      ...(dueDate && { dueDate }),
      ...(status && { status })
    });
    res.status(200).json({ message: "To-do item updated!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE (DELETE /todo/:todoID?userID=xxx)
router.delete("/:todoID", async (req, res) => {
  try {
    const { userID } = req.query;
    const { todoID } = req.params;

    if (!userID || !todoID) {
      return res.status(400).json({ error: "Missing userID or todoID" });
    }

    const docRef = db.collection("users")
      .doc(userID)
      .collection("todo")
      .doc(todoID);

    const docSnap = await docRef.get();
    if (!docSnap.exists) {
      return res.status(404).json({ error: "To-do item not found" });
    }

    await docRef.delete();
    res.status(200).json({ message: "To-do item deleted!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
