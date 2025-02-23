//This file will be responsible for connecting Node.js backend to Firebase Firestore using the Service Account Key.
const admin = require("firebase-admin");

// Load the service account key
const serviceAccount = require("./firebase-adminsdk.json"); 

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// Get Firestore database
const db = admin.firestore();

module.exports = db;
