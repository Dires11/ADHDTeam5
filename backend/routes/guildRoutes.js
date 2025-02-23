const express = require("express");
const router = express.Router();
const admin = require("firebase-admin");
const db = require("../firebaseConfig"); // Adjust path to your Firestore config

// CREATE (POST) a new Guild
router.post("/", async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ error: "Guild name is required" });
    }

    // Create guild document; Firestore auto-generates the ID
    const newGuildRef = await db.collection("guilds").add({
      name,
      createdAt: new Date(),
      members: []  // initialize with an empty array
    });

    return res.status(201).json({
      id: newGuildRef.id,
      message: "Guild created successfully",
    });
  } catch (error) {
    console.error("Error creating guild:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// READ (GET) all Guilds
router.get("/", async (req, res) => {
  try {
    const snapshot = await db.collection("guilds").get();
    const guilds = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    return res.status(200).json(guilds);
  } catch (error) {
    console.error("Error fetching guilds:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// READ (GET) a single Guild by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const guildRef = db.collection("guilds").doc(id);
    const docSnap = await guildRef.get();

    if (!docSnap.exists) {
      return res.status(404).json({ error: "Guild not found" });
    }

    return res.status(200).json({ id: docSnap.id, ...docSnap.data() });
  } catch (error) {
    console.error("Error fetching guild:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// UPDATE (PUT) a Guild (for updating name and/or description)
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    await db.collection("guilds").doc(id).update({
      name,
      description,
      updatedAt: new Date(),
    });
    return res.status(200).json({ message: "Guild updated successfully" });
  } catch (error) {
    console.error("Error updating guild:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE a Guild
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await db.collection("guilds").doc(id).delete();
    return res.status(200).json({ message: "Guild deleted successfully" });
  } catch (error) {
    console.error("Error deleting guild:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// ADD a member to a Guild
router.post("/:id/members", async (req, res) => {
  try {
    const { id } = req.params;  // guild ID from URL
    const { userId } = req.body;  // user ID to add as a member

    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }

    const guildRef = db.collection("guilds").doc(id);

    // Add userId to the members array using Firestore's arrayUnion
    await guildRef.update({
      members: admin.firestore.FieldValue.arrayUnion(userId),
      updatedAt: new Date()
    });

    return res.status(200).json({ message: "Member added successfully" });
  } catch (error) {
    console.error("Error adding member:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

// REMOVE a member from a Guild
router.delete("/:id/members", async (req, res) => {
  try {
    const { id } = req.params;  // guild ID from URL
    const { userId } = req.body;  // user ID to remove

    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }

    const guildRef = db.collection("guilds").doc(id);

    // Remove userId from the members array using arrayRemove
    await guildRef.update({
      members: admin.firestore.FieldValue.arrayRemove(userId),
      updatedAt: new Date()
    });

    return res.status(200).json({ message: "Member removed successfully" });
  } catch (error) {
    console.error("Error removing member:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});



module.exports = router;
