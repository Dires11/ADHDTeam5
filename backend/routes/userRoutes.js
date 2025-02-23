const admin = require("firebase-admin"); // Make sure this is installed & initialized
const express = require("express");
const router = express.Router();
const db = require("../firebaseConfig"); // Firestore from firebaseConfig.js

// CREATE (POST /users)
router.post("/", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ error: "Missing required fields!" });
    }

    // 1) Create the user in Firebase Auth (Admin SDK)
    const userRecord = await admin.auth().createUser({
      email,
      password,
      displayName: username // optional, sets displayName in Auth
    });

    const uid = userRecord.uid; // e.g. "WogXHfWZqIMvgWvTBI37DiJKV6G3"

    // 2) Create a Firestore doc with doc ID = uid
    await db.collection("users").doc(uid).set({
      username,
      email,
      password,      // storing plain password is not recommended
      createdAt: new Date()
    });

    // 3) Return success
    res.status(201).json({ id: uid, message: "User created in Auth + Firestore!" });
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
    const { username, email, password } = req.body;

    // 1) Check if doc exists in Firestore
    const userRef = db.collection("users").doc(req.params.id);
    const userSnap = await userRef.get();
    if (!userSnap.exists) {
      return res.status(404).json({ error: "User not found" });
    }

    // 2) Optionally update Auth user as well:
    // await admin.auth().updateUser(req.params.id, {
    //   email,
    //   password,
    //   displayName: username
    // });

    // 3) Update Firestore doc
    await userRef.update({
      ...(username && { username }),
      ...(email && { email }),
      ...(password && { password }) // again, consider not storing plain password
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

    // 1) Optionally delete from Auth:
    // await admin.auth().deleteUser(req.params.id);

    // 2) Delete Firestore doc
    await userRef.delete();

    res.status(200).json({ message: "User deleted successfully!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
