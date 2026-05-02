import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole } from '../types';
import { auth, db, getDoc, setDoc } from '../services/firebaseSimulator';

interface AuthContextType {
  user: UserProfile | null;
  loading: boolean;
  loginWithGoogle: (role: UserRole) => Promise<void>;
  signupWithEmail: (email: string, pass: string, role: UserRole) => Promise<void>;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshProfile: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser: any) => {
      if (firebaseUser) {
        // Fetch profile from Firestore (simulated)
        const docRef = db.doc(db.collection('users'), firebaseUser.uid);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setUser(docSnap.data());
        } else {
          // Profile doesn't exist yet, but user is authed
          // This happens between signup and onboarding
          // We temp set a partial user
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            name: firebaseUser.displayName || '',
            role: null as any, // Will be set during onboarding or selection
            onboarded: false,
            createdAt: Date.now()
          } as UserProfile);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const loginWithGoogle = async (role: UserRole) => {
    setLoading(true);
    try {
      const { user: firebaseUser } = await auth.signInWithPopup(null);
      // Check if profile exists
      const docRef = db.doc(db.collection('users'), firebaseUser.uid);
      const docSnap = await getDoc(docRef);
      
      if (!docSnap.exists()) {
        const newProfile: UserProfile = {
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          name: firebaseUser.displayName || '',
          role,
          onboarded: false,
          createdAt: Date.now(),
          sharingEnabled: true
        };
        await setDoc(docRef, newProfile);
        setUser(newProfile);
      } else {
        setUser(docSnap.data());
      }
    } finally {
      setLoading(false);
    }
  };

  const signupWithEmail = async (email: string, pass: string, role: UserRole) => {
    setLoading(true);
    try {
      const { user: firebaseUser } = await auth.createUserWithEmailAndPassword(email, pass);
      const newProfile: UserProfile = {
        uid: firebaseUser.uid,
        email: firebaseUser.email,
        name: firebaseUser.displayName || '',
        role,
        onboarded: false,
        createdAt: Date.now(),
        sharingEnabled: true
      };
      await setDoc(db.doc(db.collection('users'), firebaseUser.uid), newProfile);
      setUser(newProfile);
    } finally {
      setLoading(false);
    }
  };

  const loginWithEmail = async (email: string, pass: string) => {
    setLoading(true);
    try {
      const { user: firebaseUser } = await auth.signInWithEmailAndPassword(email, pass);
      const docSnap = await getDoc(db.doc(db.collection('users'), firebaseUser.uid));
      if (docSnap.exists()) {
        setUser(docSnap.data());
      }
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await auth.signOut();
    setUser(null);
  };

  const refreshProfile = async () => {
    if (user) {
      const docSnap = await getDoc(db.doc(db.collection('users'), user.uid));
      if (docSnap.exists()) {
        setUser(docSnap.data());
      }
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      loginWithGoogle, 
      signupWithEmail, 
      loginWithEmail, 
      logout, 
      refreshProfile 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
