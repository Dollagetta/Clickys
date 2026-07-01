import { getApps, initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import config from '../firebase-applet-config.json' with { type: "json" };

// Parse the service account key from the environment variable
let serviceAccount;
try {
  if (process.env.FIREBASE_SERVICE_ACCOUNT_KEY) {
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY);
  }
} catch (error) {
  console.error("Error parsing FIREBASE_SERVICE_ACCOUNT_KEY:", error.message);
}

// Initialize the Firebase Admin SDK if it hasn't been initialized yet
if (!getApps().length) {
  if (serviceAccount) {
    initializeApp({
      credential: cert(serviceAccount),
      projectId: config.projectId
    });
  } else {
    // Fallback or warning if no service account is found
    console.warn("FIREBASE_SERVICE_ACCOUNT_KEY environment variable is not set. Admin SDK will not be able to bypass security rules locally without application default credentials.");
    initializeApp({
      projectId: config.projectId
    });
  }
}

export const adminDb = getFirestore(config.firestoreDatabaseId);
