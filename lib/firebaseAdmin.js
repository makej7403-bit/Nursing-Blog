// lib/firebaseAdmin.js
import admin from "firebase-admin";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      project_id: process.env.FIREBASE_ADMIN_PROJECT_ID,
      private_key: process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      client_email: process.env.FIREBASE_ADMIN_CLIENT_EMAIL,
    }),
    storageBucket: process.env.FIREBASE_ADMIN_STORAGE_BUCKET,
  });
}

export const adminDb = admin.firestore();
export const adminStorage = admin.storage();
export default admin;
