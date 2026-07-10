import { createContext, useContext, useEffect, useState } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  updateProfile
} from 'firebase/auth';
import { auth } from '../lib/firebase';
import axios from 'axios';

import { useQueryClient } from '@tanstack/react-query';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const queryClient = useQueryClient();

  async function signup(email, password, username) {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(userCredential.user, { displayName: username });
    
    // Create user in our backend database
    const token = await userCredential.user.getIdToken();
    await axios.post(
      `${import.meta.env.VITE_API_URL}/auth/register`, 
      { email, name: username, firebaseId: userCredential.user.uid },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    
    return userCredential;
  }

  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  function logout() {
    queryClient.clear();
    return signOut(auth);
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    login,
    signup,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {loading ? (
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 transition-opacity duration-300">
          <div className="flex items-center gap-3 animate-pulse">
            <span className="w-8 h-8 rounded-full bg-primary brutal-border inline-block shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]"></span>
            <span className="font-black text-3xl tracking-tighter uppercase text-foreground">Knoledge</span>
          </div>
          <div className="mt-8 flex gap-2">
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.3s]"></div>
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce [animation-delay:-0.15s]"></div>
            <div className="w-2 h-2 bg-primary rounded-full animate-bounce"></div>
          </div>
        </div>
      ) : children}
    </AuthContext.Provider>
  );
}
