import firebase_admin
from firebase_admin import credentials, firestore

# Path to your Firebase service account key JSON file
cred = credentials.Certificate("path/to/your/serviceAccountKey.json")

# Initialize Firebase app
firebase_admin.initialize_app(cred)

# Get Firestore database
db = firestore.client()
