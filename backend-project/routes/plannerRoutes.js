const express = require("express");
const router = express.Router();
const db = require("../firebaseConfig");

// CREATE (POST /planner)
router.post("/", async (req, res) => {
  try {
    const { userID, title, category, dueDate, status } = req.body;
    if (!userID || !title || !category) {
      return res.status(400).json({ error: "Missing required fields!" });
    }

    const newPlan = await db.collection("planner").add({
      userID,
      title,
      category,
      dueDate: dueDate || null,
      status: status || "Pending",
      createdAt: new Date()
    });

    res.status(201).json({ id: newPlan.id, message: "Planner task created!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// READ ALL (GET /planner)
router.get("/", async (req, res) => {
  try {
    const snapshot = await db.collection("planner").get();
    const tasks = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// READ ONE (GET /planner/:id)
router.get("/:id", async (req, res) => {
  try {
    const docRef = db.collection("planner").doc(req.params.id);
    const docSnap = await docRef.get();
    if (!docSnap.exists) {
      return res.status(404).json({ error: "Planner task not found" });
    }
    res.status(200).json({ id: docSnap.id, ...docSnap.data() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// UPDATE (PUT /planner/:id)
router.put("/:id", async (req, res) => {
  try {
    const { title, category, dueDate, status } = req.body;
    const docRef = db.collection("planner").doc(req.params.id);
    const docSnap = await docRef.get();
    if (!docSnap.exists) {
      return res.status(404).json({ error: "Planner task not found" });
    }

    await docRef.update({
      ...(title && { title }),
      ...(category && { category }),
      ...(dueDate && { dueDate }),
      ...(status && { status })
    });
    res.status(200).json({ message: "Planner task updated!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE (DELETE /planner/:id)
router.delete("/:id", async (req, res) => {
  try {
    const docRef = db.collection("planner").doc(req.params.id);
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
