import { initializeApp, getApps, getApp } from 'firebase/app';
import firebaseConfig from '../firebase-applet-config.json';

export const getDb = async () => {
  const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
  const { getFirestore } = await import('firebase/firestore');
  return getFirestore(app, firebaseConfig.firestoreDatabaseId || '(default)');
};

