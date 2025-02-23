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

    const newTodo = await db.collection("todo").add({
      userID,
      taskName,
      priority: priority || "Medium",
      dueDate: dueDate || null,
      status: status || "Pending",
      createdAt: new Date()
    });

    res.status(201).json({ id: newTodo.id, message: "To-do item created!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// READ ALL (GET /todo)
router.get("/", async (req, res) => {
  try {
    const snapshot = await db.collection("todo").get();
    const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(items);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// READ ONE (GET /todo/:id)
router.get("/:id", async (req, res) => {
  try {
    const docRef = db.collection("todo").doc(req.params.id);
    const docSnap = await docRef.get();
    if (!docSnap.exists) {
      return res.status(404).json({ error: "To-do item not found" });
    }
    res.status(200).json({ id: docSnap.id, ...docSnap.data() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// UPDATE (PUT /todo/:id)
router.put("/:id", async (req, res) => {
  try {
    const { taskName, priority, dueDate, status } = req.body;
    const docRef = db.collection("todo").doc(req.params.id);
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

// DELETE (DELETE /todo/:id)
router.delete("/:id", async (req, res) => {
  try {
    const docRef = db.collection("todo").doc(req.params.id);
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
