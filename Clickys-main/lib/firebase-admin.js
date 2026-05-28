import * as admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';
import config from '../firebase-applet-config.json';

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
if (!admin.apps.length) {
  if (serviceAccount) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      projectId: config.projectId
    });
  } else {
    // Fallback or warning if no service account is found
    console.warn("FIREBASE_SERVICE_ACCOUNT_KEY environment variable is not set. Admin SDK will not be able to bypass security rules locally without application default credentials.");
    admin.initializeApp({
      projectId: config.projectId
    });
  }
}

export const adminDb = getFirestore(admin.app(), config.firestoreDatabaseId);
