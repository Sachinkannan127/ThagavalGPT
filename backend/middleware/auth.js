import { auth, firebaseInitialized } from '../config/firebase.js';

export const verifyToken = async (req, res, next) => {
  // Skip auth if Firebase is not initialized (for testing/development)
  if (!firebaseInitialized) {
    console.warn('⚠️  Firebase auth disabled - skipping token verification');
    req.user = { uid: 'demo-user', email: 'demo@thagavalgpt.com', name: 'Demo User' };
    return next();
  }

  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.error('No authorization header found');
      return res.status(401).json({ 
        error: 'Unauthorized: No token provided',
        message: 'Please login again to continue'
      });
    }

    const token = authHeader.split('Bearer ')[1];
    
    try {
      const decodedToken = await auth.verifyIdToken(token);
      req.user = decodedToken;
      next();
    } catch (tokenError) {
      console.error('Token verification failed:', tokenError.message);
      return res.status(401).json({ 
        error: 'Unauthorized: Invalid or expired token',
        message: 'Your session has expired. Please login again.'
      });
    }
  } catch (error) {
    console.error('Token verification error:', error);
    return res.status(401).json({ 
      error: 'Unauthorized: Authentication failed',
      message: 'Authentication error. Please try logging in again.'
    });
  }
};
