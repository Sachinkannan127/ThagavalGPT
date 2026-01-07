import React, { createContext, useState, useEffect } from 'react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
  updateProfile,
  signInWithPopup,
  GoogleAuthProvider,
  GithubAuthProvider
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import toast from 'react-hot-toast';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        // Get additional user data from Firestore
        const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
        setUser({
          ...currentUser,
          ...userDoc.data()
        });
        
        // Store token
        const token = await currentUser.getIdToken();
        localStorage.setItem('authToken', token);
      } else {
        setUser(null);
        localStorage.removeItem('authToken');
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const register = async (email, password, displayName) => {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      
      // Update profile
      await updateProfile(result.user, { displayName });
      
      // Create user document in Firestore
      await setDoc(doc(db, 'users', result.user.uid), {
        uid: result.user.uid,
        email: email,
        displayName: displayName,
        createdAt: new Date().toISOString(),
        photoURL: null
      });

      // Store token immediately
      const token = await result.user.getIdToken();
      localStorage.setItem('authToken', token);
      
      // Update user state immediately
      const userData = {
        ...result.user,
        displayName,
        email
      };
      setUser(userData);

      toast.success('Account created successfully!');
      return userData;
    } catch (error) {
      toast.error(error.message);
      throw error;
    }
  };

  const login = async (email, password) => {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      
      // Wait for the auth state to be updated and token to be stored
      const token = await result.user.getIdToken();
      localStorage.setItem('authToken', token);
      
      // Get user data from Firestore
      const userDoc = await getDoc(doc(db, 'users', result.user.uid));
      const userData = {
        ...result.user,
        ...userDoc.data()
      };
      
      // Update user state immediately
      setUser(userData);
      
      toast.success('Logged in successfully!');
      return userData;
    } catch (error) {
      toast.error(error.message);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      toast.success('Logged out successfully!');
    } catch (error) {
      toast.error(error.message);
      throw error;
    }
  };

  const resetPassword = async (email) => {
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success('Password reset email sent!');
    } catch (error) {
      toast.error(error.message);
      throw error;
    }
  };

  const signInWithGoogle = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      
      // Store token
      const token = await result.user.getIdToken();
      localStorage.setItem('authToken', token);
      
      // Check if user document exists, if not create it
      const userDocRef = doc(db, 'users', result.user.uid);
      const userDoc = await getDoc(userDocRef);
      
      if (!userDoc.exists()) {
        await setDoc(userDocRef, {
          uid: result.user.uid,
          email: result.user.email,
          displayName: result.user.displayName,
          photoURL: result.user.photoURL,
          createdAt: new Date().toISOString()
        });
      }
      
      // Update user state
      const userData = {
        ...result.user,
        ...(userDoc.exists() ? userDoc.data() : {})
      };
      setUser(userData);
      
      toast.success('Signed in with Google successfully!');
      return userData;
    } catch (error) {
      if (error.code !== 'auth/popup-closed-by-user') {
        toast.error(error.message);
      }
      throw error;
    }
  };

  const signInWithGithub = async () => {
    try {
      const provider = new GithubAuthProvider();
      const result = await signInWithPopup(auth, provider);
      
      // Store token
      const token = await result.user.getIdToken();
      localStorage.setItem('authToken', token);
      
      // Check if user document exists, if not create it
      const userDocRef = doc(db, 'users', result.user.uid);
      const userDoc = await getDoc(userDocRef);
      
      if (!userDoc.exists()) {
        await setDoc(userDocRef, {
          uid: result.user.uid,
          email: result.user.email,
          displayName: result.user.displayName,
          photoURL: result.user.photoURL,
          createdAt: new Date().toISOString()
        });
      }
      
      // Update user state
      const userData = {
        ...result.user,
        ...(userDoc.exists() ? userDoc.data() : {})
      };
      setUser(userData);
      
      toast.success('Signed in with GitHub successfully!');
      return userData;
    } catch (error) {
      if (error.code !== 'auth/popup-closed-by-user') {
        toast.error(error.message);
      }
      throw error;
    }
  };

  const value = {
    user,
    register,
    login,
    logout,
    resetPassword,
    signInWithGoogle,
    signInWithGithub,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
