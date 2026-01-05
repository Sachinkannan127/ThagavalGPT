import { auth, firebaseInitialized } from '../config/firebase.js';

export const verifyToken = async (req, res, next) => {
  // Skip auth if Firebase is not initialized (for testing Gemini API)
  if (!firebaseInitialized) {
    console.warn('⚠️  Firebase auth disabled - skipping token verification');
    req.user = { uid: 'test-user', email: 'test@example.com' };
    return next();
  }

  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }

    const token = authHeader.split('Bearer ')[1];
    
    const decodedToken = await auth.verifyIdToken(token);
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error('Token verification error:', error);
    return res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
};
