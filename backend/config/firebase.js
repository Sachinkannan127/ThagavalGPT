import admin from 'firebase-admin';
import dotenv from 'dotenv';

dotenv.config();

let serviceAccount;
let firebaseInitialized = false;

// Try to load service account from file or environment variables
if (process.env.FIREBASE_SERVICE_ACCOUNT_PATH) {
  try {
    serviceAccount = await import(process.env.FIREBASE_SERVICE_ACCOUNT_PATH, {
      assert: { type: 'json' }
    });
  } catch (error) {
    console.error('Error loading service account file:', error.message);
  }
}

// Initialize Firebase Admin
if (serviceAccount) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount.default),
  });
  firebaseInitialized = true;
  console.log('✅ Firebase Admin SDK initialized');
} else if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
    });
    firebaseInitialized = true;
    console.log('✅ Firebase Admin SDK initialized');
  } catch (error) {
    console.error('❌ Firebase Admin SDK initialization failed:', error.message);
  }
} else {
  console.warn('⚠️  Firebase Admin SDK not initialized. Firebase features disabled.');
}

export const db = firebaseInitialized ? admin.firestore() : null;
export const auth = firebaseInitialized ? admin.auth() : null;
export { firebaseInitialized };

export default admin;
