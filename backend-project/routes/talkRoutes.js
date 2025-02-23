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

    const newTalk = await db.collection("talks").add({
      userID,
      contactUserID,
      taskCompletion: taskCompletion || "",
      createdAt: new Date()
    });

    res.status(201).json({ id: newTalk.id, message: "Talk entry created!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// READ ALL (GET /talk)
router.get("/", async (req, res) => {
  try {
    const snapshot = await db.collection("talks").get();
    const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// READ ONE (GET /talk/:id)
router.get("/:id", async (req, res) => {
  try {
    const docRef = db.collection("talks").doc(req.params.id);
    const docSnap = await docRef.get();
    if (!docSnap.exists) {
      return res.status(404).json({ error: "Talk entry not found" });
    }
    res.status(200).json({ id: docSnap.id, ...docSnap.data() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// UPDATE (PUT /talk/:id)
router.put("/:id", async (req, res) => {
  try {
    const { contactUserID, taskCompletion } = req.body;
    const docRef = db.collection("talks").doc(req.params.id);
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

// DELETE (DELETE /talk/:id)
router.delete("/:id", async (req, res) => {
  try {
    const docRef = db.collection("talks").doc(req.params.id);
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
