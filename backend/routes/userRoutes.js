const express = require("express");
const router = express.Router();
const db = require("../firebaseConfig");

// CREATE (POST /users)
router.post("/", async (req, res) => {
  try {
    const { username, email, password, points = 0 } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ error: "Missing required fields!" });
    }

    const newUser = await db.collection("users").add({
      username,
      email,
      password,
      userID,
      points, //initialize points
      createdAt: new Date()
    });

    res.status(201).json({ id: newUser.id, message: "User created successfully!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// READ ALL (GET /users)
router.get("/", async (req, res) => {
  try {
    const snapshot = await db.collection("users").get();
    const users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// READ ONE (GET /users/:id)
router.get("/:id", async (req, res) => {
  try {
    const userRef = db.collection("users").doc(req.params.id);
    const userSnap = await userRef.get();
    if (!userSnap.exists) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json({ id: userSnap.id, ...userSnap.data() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// UPDATE (PUT /users/:id)
router.put("/:id", async (req, res) => {
  try {
    const { username, email, password, points } = req.body;
    const userRef = db.collection("users").doc(req.params.id);
    const userSnap = await userRef.get();
    if (!userSnap.exists) {
      return res.status(404).json({ error: "User not found" });
    }

    await userRef.update({
      ...(username && { username }),
      ...(email && { email }),
      ...(password && { password }),
      ...(points !== undefined && { points }) // Update points if provided
    });
    res.status(200).json({ message: "User updated successfully!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE (DELETE /users/:id)
router.delete("/:id", async (req, res) => {
  try {
    const userRef = db.collection("users").doc(req.params.id);
    const userSnap = await userRef.get();
    if (!userSnap.exists) {
      return res.status(404).json({ error: "User not found" });
    }

    await userRef.delete();
    res.status(200).json({ message: "User deleted successfully!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ADD or DEDUCT POINTS TO A USER (POST /users/:id/points) 
//you can input a negative number so it deducts the points 
router.post("/:id/points", async (req, res) => {
  try {
    const { id } = req.params;
    const { points } = req.body;

    if (typeof points !== "number") {
      return res.status(400).json({ error: "Points must be a number" });
    }

    const userRef = db.collection("users").doc(id);
    const userSnap = await userRef.get();

    if (!userSnap.exists) {
      return res.status(404).json({ error: "User not found" });
    }

    // Get the current points of the user
    const currentPoints = userSnap.data().points || 0;

    // Prevent points from going below zero
    const newPoints = currentPoints + points;
    if (newPoints < 0) {
      return res.status(400).json({ error: "Insufficient points. Cannot deduct below zero." });
    }

    // Update the user's points using Firestore's increment function
    await userRef.update({
      points: admin.firestore.FieldValue.increment(points)
    });

    const action = points >= 0 ? "Added" : "Deducted";
    res.status(200).json({ message: `${action} ${Math.abs(points)} points for user ${id}` });
  } catch (error) {
    console.error("Error updating points for user:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

module.exports = router;
