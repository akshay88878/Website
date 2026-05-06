import { cert, getApp, getApps, initializeApp } from "firebase-admin/app";
import { getFirestore } from "firebase-admin/firestore";
import { getStorage } from "firebase-admin/storage";

function getFirebaseAdminProjectId() {
  return process.env.FIREBASE_ADMIN_PROJECT_ID || process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID;
}

function getFirebaseAdminClientEmail() {
  return process.env.FIREBASE_ADMIN_CLIENT_EMAIL || null;
}

function getFirebaseAdminPrivateKey() {
  const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY;

  if (!privateKey) {
    return null;
  }

  return privateKey.replace(/\\n/g, "\n");
}

export function hasFirebaseAdminConfig() {
  return Boolean(
    getFirebaseAdminProjectId() &&
      getFirebaseAdminClientEmail() &&
      getFirebaseAdminPrivateKey()
  );
}

export function getFirebaseAdminConfigErrorMessage() {
  return (
    "Firebase Admin is not configured. Set FIREBASE_ADMIN_PROJECT_ID, " +
    "FIREBASE_ADMIN_CLIENT_EMAIL, and FIREBASE_ADMIN_PRIVATE_KEY for server-side site config saves."
  );
}

function getRequiredFirebaseAdminConfig() {
  const projectId = getFirebaseAdminProjectId();
  const clientEmail = getFirebaseAdminClientEmail();
  const privateKey = getFirebaseAdminPrivateKey();

  if (!projectId || !clientEmail || !privateKey) {
    throw new Error(getFirebaseAdminConfigErrorMessage());
  }

  return {
    projectId,
    clientEmail,
    privateKey
  };
}

export function getFirebaseAdminApp() {
  const { projectId, clientEmail, privateKey } = getRequiredFirebaseAdminConfig();

  return getApps().length
    ? getApp()
    : initializeApp({
        credential: cert({
          projectId,
          clientEmail,
          privateKey
        }),
        projectId
      });
}

export function getFirebaseAdminDb() {
  return getFirestore(getFirebaseAdminApp());
}

export function getFirebaseAdminStorage() {
  return getStorage(getFirebaseAdminApp());
}
