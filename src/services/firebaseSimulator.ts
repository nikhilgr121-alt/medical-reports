import { UserRole } from '../types';

// Real-looking Firebase interface
export const auth = {
  currentUser: null as any,
  onAuthStateChanged: (callback: (user: any) => void) => {
    const saved = localStorage.getItem('sim_user');
    if (saved) {
      const user = JSON.parse(saved);
      auth.currentUser = user;
      callback(user);
    } else {
      callback(null);
    }
    return () => {};
  },
  signInWithPopup: async (provider: any) => {
    // Simulate Google Login
    const user = {
      uid: 'google-' + Math.random().toString(36).substring(7),
      email: 'user@gmail.com',
      displayName: 'Google User',
      photoURL: 'https://api.dicebear.com/7.x/avataaars/svg?seed=google',
    };
    localStorage.setItem('sim_user', JSON.stringify(user));
    auth.currentUser = user;
    return { user };
  },
  createUserWithEmailAndPassword: async (email: string, pass: string) => {
    const user = {
      uid: 'mail-' + Math.random().toString(36).substring(7),
      email,
      displayName: email.split('@')[0],
    };
    localStorage.setItem('sim_user', JSON.stringify(user));
    auth.currentUser = user;
    return { user };
  },
  signInWithEmailAndPassword: async (email: string, pass: string) => {
    const user = {
      uid: 'mail-' + Math.random().toString(36).substring(7),
      email,
      displayName: email.split('@')[0],
    };
    localStorage.setItem('sim_user', JSON.stringify(user));
    auth.currentUser = user;
    return { user };
  },
  signOut: async () => {
    localStorage.removeItem('sim_user');
    auth.currentUser = null;
  }
};

export const GoogleAuthProvider = class {};

export const db = {
  collection: (path: string) => ({ path }),
  doc: (collection: any, id: string) => ({ collection, id }),
};

export const getDoc = async (docRef: any) => {
  const data = localStorage.getItem(`sim_db_${docRef.collection.path}_${docRef.id}`);
  return {
    exists: () => !!data,
    data: () => data ? JSON.parse(data) : null,
  };
};

export const setDoc = async (docRef: any, data: any) => {
  localStorage.setItem(`sim_db_${docRef.collection.path}_${docRef.id}`, JSON.stringify(data));
};

export const updateDoc = async (docRef: any, data: any) => {
  const existing = localStorage.getItem(`sim_db_${docRef.collection.path}_${docRef.id}`);
  const merged = { ...(existing ? JSON.parse(existing) : {}), ...data };
  localStorage.setItem(`sim_db_${docRef.collection.path}_${docRef.id}`, JSON.stringify(merged));
};

export const query = (colRef: any, ...constraints: any[]) => colRef;
export const where = (...args: any[]) => ({ type: 'where' });
export const orderBy = (...args: any[]) => ({ type: 'orderBy' });
export const limit = (...args: any[]) => ({ type: 'limit' });

export const getDocs = async (query: any) => {
  const keys = Object.keys(localStorage).filter(k => k.startsWith(`sim_db_${query.path}_`));
  const docs = keys.map(k => ({
    id: k.split('_').pop(),
    data: () => JSON.parse(localStorage.getItem(k) || '{}'),
  }));
  return { docs };
};

export const storage = {
  ref: (path: string) => ({ path }),
};

export const uploadBytes = async (ref: any, file: File) => {
  // Simulate upload
  return { ref };
};

export const getDownloadURL = async (ref: any) => {
  return "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf";
};
