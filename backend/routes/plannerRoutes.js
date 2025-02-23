const express = require("express");
const router = express.Router();
const db = require("../firebaseConfig");

// CREATE (POST /planner)
router.post("/", async (req, res) => {
  try {
    const { userID, title, description, category, status, dueDate } = req.body;
    if (!userID || !title || !category) {
      return res.status(400).json({ error: "Missing required fields!" });
    }

    const docRef = await db.collection("users")
      .doc(userID)
      .collection("planner")
      .add({
        title,
        description: description || "",
        category,
        status: status || "Pending",
        dueDate: dueDate || null,
        createdAt: new Date()
      });

    res.status(201).json({ id: docRef.id, message: "Planner task created under user!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// READ ALL (GET /planner?userID=xxx)
router.get("/", async (req, res) => {
  try {
    const { userID } = req.query;
    if (!userID) {
      return res.status(400).json({ error: "Missing userID in query" });
    }

    const snapshot = await db.collection("users")
      .doc(userID)
      .collection("planner")
      .get();

    const tasks = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// READ ONE (GET /planner/:taskID?userID=xxx)
router.get("/:taskID", async (req, res) => {
  try {
    const { userID } = req.query;
    const { taskID } = req.params;
    if (!userID || !taskID) {
      return res.status(400).json({ error: "Missing userID or taskID" });
    }

    const docRef = db.collection("users")
      .doc(userID)
      .collection("planner")
      .doc(taskID);

    const docSnap = await docRef.get();
    if (!docSnap.exists) {
      return res.status(404).json({ error: "Planner task not found" });
    }

    res.status(200).json({ id: docSnap.id, ...docSnap.data() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// UPDATE (PUT /planner/:taskID?userID=xxx)
router.put("/:taskID", async (req, res) => {
  try {
    const { userID } = req.query;
    const { taskID } = req.params;
    const { title, description, category, status, dueDate } = req.body;

    if (!userID || !taskID) {
      return res.status(400).json({ error: "Missing userID or taskID" });
    }

    const docRef = db.collection("users")
      .doc(userID)
      .collection("planner")
      .doc(taskID);

    const docSnap = await docRef.get();
    if (!docSnap.exists) {
      return res.status(404).json({ error: "Planner task not found" });
    }

    await docRef.update({
      ...(title && { title }),
      ...(description && { description }),
      ...(category && { category }),
      ...(status && { status }),
      ...(dueDate && { dueDate })
    });
    res.status(200).json({ message: "Planner task updated!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE (DELETE /planner/:taskID?userID=xxx)
router.delete("/:taskID", async (req, res) => {
  try {
    const { userID } = req.query;
    const { taskID } = req.params;

    if (!userID || !taskID) {
      return res.status(400).json({ error: "Missing userID or taskID" });
    }

    const docRef = db.collection("users")
      .doc(userID)
      .collection("planner")
      .doc(taskID);

    const docSnap = await docRef.get();
    if (!docSnap.exists) {
      return res.status(404).json({ error: "Planner task not found" });
    }

    await docRef.delete();
    res.status(200).json({ message: "Planner task deleted!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
