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
  try {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount.default),
    });
    firebaseInitialized = true;
    console.log('✅ Firebase Admin SDK initialized from service account file');
  } catch (error) {
    console.error('❌ Firebase Admin SDK initialization failed:', error.message);
  }
} else if (process.env.FIREBASE_PROJECT_ID && process.env.FIREBASE_CLIENT_EMAIL && process.env.FIREBASE_PRIVATE_KEY) {
  try {
    // Handle private key formatting - it might come as escaped string
    let privateKey = process.env.FIREBASE_PRIVATE_KEY;
    
    // If the key doesn't start with -----BEGIN, it might be escaped
    if (!privateKey.includes('-----BEGIN')) {
      // Try to fix common issues
      privateKey = privateKey.replace(/\\n/g, '\n');
    }
    
    // Validate the key has proper PEM format
    if (!privateKey.includes('-----BEGIN PRIVATE KEY-----') || !privateKey.includes('-----END PRIVATE KEY-----')) {
      throw new Error('Private key is not in valid PEM format. Please check your FIREBASE_PRIVATE_KEY in .env file.');
    }
    
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: privateKey,
      }),
    });
    firebaseInitialized = true;
    console.log('✅ Firebase Admin SDK initialized from environment variables');
  } catch (error) {
    console.error('❌ Firebase Admin SDK initialization failed:', error.message);
    console.warn('⚠️  Continuing without Firebase. App will use localStorage only.');
  }
} else {
  console.warn('⚠️  Firebase Admin SDK not initialized. Firebase features disabled.');
  console.log('   App will work with localStorage instead of Firestore.');
}

export const db = firebaseInitialized ? admin.firestore() : null;
export const auth = firebaseInitialized ? admin.auth() : null;
export { firebaseInitialized };

export default admin;
