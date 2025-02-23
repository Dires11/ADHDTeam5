const db = require("./firebase_setup.js"); 

async function testConnection() {
  try {
    // Write a test document
    const docRef = await db.collection("testCollection").add({
      message: "Hello from the backend!"
    });
    console.log("Document written with ID:", docRef.id);

    // Read the document back
    const snapshot = await db.collection("testCollection").doc(docRef.id).get();
    console.log("Retrieved document:", snapshot.data());
  } catch (error) {
    console.error("Error connecting to Firestore:", error);
  }
}

testConnection();
