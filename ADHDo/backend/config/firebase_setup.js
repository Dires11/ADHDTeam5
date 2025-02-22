const admin = require("firebase-admin");
const serviceAccount = require("./backend/config/ss12-4cc47-firebase-adminsdk-fbsvc-0f1282ca43.json");

// Initialize Firebase
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

// Initialize Firestore
const db = admin.firestore();

module.exports = db;
