import React, { createContext, useState, useEffect, useContext } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  RecaptchaVerifier,
  signInWithPhoneNumber,
  signOut, 
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [accountType, setAccountType] = useState(null); // 'patient' or 'clinic'

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user);
      if (user) {
        // Load account type from Firestore
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          setAccountType(userDoc.data().accountType);
        }
      } else {
        setAccountType(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signup = async (email, password, accountType = 'patient') => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      // Save account type to Firestore
      await setDoc(doc(db, 'users', userCredential.user.uid), {
        email: userCredential.user.email,
        accountType: accountType,
        createdAt: new Date().toISOString()
      });
      setAccountType(accountType);
      return { success: true, user: userCredential.user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      // Load account type
      const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
      if (userDoc.exists()) {
        setAccountType(userDoc.data().accountType);
      }
      return { success: true, user: userCredential.user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const signInWithGoogle = async (accountType = 'patient') => {
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      
      // Check if user already has account type, if not set it
      const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
      if (!userDoc.exists()) {
        await setDoc(doc(db, 'users', userCredential.user.uid), {
          email: userCredential.user.email,
          displayName: userCredential.user.displayName,
          accountType: accountType,
          createdAt: new Date().toISOString()
        });
        setAccountType(accountType);
      } else {
        setAccountType(userDoc.data().accountType);
      }
      
      return { success: true, user: userCredential.user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const signInWithPhone = async (phoneNumber, appVerifier, accountType = 'patient') => {
    try {
      const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
      return { success: true, confirmationResult };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const verifyPhoneCode = async (confirmationResult, code, accountType = 'patient') => {
    try {
      const userCredential = await confirmationResult.confirm(code);
      
      // Check if user already has account type, if not set it
      const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
      if (!userDoc.exists()) {
        await setDoc(doc(db, 'users', userCredential.user.uid), {
          phoneNumber: userCredential.user.phoneNumber,
          accountType: accountType,
          createdAt: new Date().toISOString()
        });
        setAccountType(accountType);
      } else {
        setAccountType(userDoc.data().accountType);
      }
      
      return { success: true, user: userCredential.user };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setAccountType(null);
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const value = {
    user,
    loading,
    accountType,
    signup,
    login,
    signInWithGoogle,
    signInWithPhone,
    verifyPhoneCode,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
