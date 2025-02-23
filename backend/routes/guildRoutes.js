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

// UPDATE (PUT) a Guild
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

// ADD a member to a Guild with duplicate check
router.post("/:id/members", async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({ error: "userId is required" });
    }

    const userRef = db.collection("users").doc(userId);
    const userSnap = await userRef.get();

    if (!userSnap.exists) {
      return res.status(404).json({ error: "User not found" });
    }

    const guildRef = db.collection("guilds").doc(id);
    const guildSnap = await guildRef.get();

    if (!guildSnap.exists) {
      return res.status(404).json({ error: "Guild not found" });
    }

    const guildData = guildSnap.data();

    if (guildData.members && guildData.members.includes(userId)) {
      return res.status(400).json({ message: "User is already a member of this guild." });
    }

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

// GET ranked members of a Guild (GET /guilds/:id/rank)
router.get("/:id/rank", async (req, res) => {
  try {
    const { id } = req.params;

    // Fetch the guild document
    const guildRef = db.collection("guilds").doc(id);
    const guildSnap = await guildRef.get();

    if (!guildSnap.exists) {
      return res.status(404).json({ error: "Guild not found" });
    }

    const guildData = guildSnap.data();

    // Check if the guild has members
    if (!guildData.members || guildData.members.length === 0) {
      return res.status(200).json({ message: "No members to rank in this guild." });
    }

    // Fetch all members' data from the "users" collection
    const membersSnapshot = await db.collection("users")
      .where(admin.firestore.FieldPath.documentId(), "in", guildData.members)
      .select("username", "points") // Fetch only required fields
      .get();

    if (membersSnapshot.empty) {
      return res.status(200).json({ message: "No valid users found for ranking." });
    }

    // Build a list of users with points and names
    const members = membersSnapshot.docs.map(doc => ({
      id: doc.id,
      username: doc.data().username,
      points: doc.data().points || 0, // Default to 0 if points field is missing
    }));

    // Sort members by points (descending), then by username (ascending)
    const sortedMembers = members.sort((a, b) => {
      if (b.points === a.points) {
        return a.username.localeCompare(b.username); // Sort by name if points are equal
      }
      return b.points - a.points; // Sort by points (highest first)
    });

    // Assign ranks without skipping for ties
    let rank = 1;
    let previousPoints = null;
    let displayedRank = 1;
    
    const rankedMembers = sortedMembers.map((member, index) => {
      if (previousPoints !== null && member.points < previousPoints) {
        displayedRank = rank;
      }
      previousPoints = member.points;
      rank++;

      return {
        rank: displayedRank,
        ...member,
      };
    });

    return res.status(200).json(rankedMembers);
  } catch (error) {
    console.error("Error fetching member rankings:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
