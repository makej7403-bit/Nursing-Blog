// lib/firebaseAdmin.js
import admin from "firebase-admin";

let adminApp = null;

export function getAdminApp() {
  if (adminApp) return adminApp;

  const raw = process.env.FIREBASE_SERVICE_ACCOUNT;
  if (!raw) throw new Error("FIREBASE_SERVICE_ACCOUNT env var missing");

  const serviceAccount = typeof raw === "string" && raw.trim().startsWith("{") ? JSON.parse(raw) : raw;
  const bucketName = process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET || (serviceAccount.project_id + ".appspot.com");

  adminApp = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: bucketName
  });

  return adminApp;
}

export function getAdminFirestore() {
  return getAdminApp().firestore();
}

export function getAdminStorage() {
  return getAdminApp().storage().bucket();
}
