import React, { createContext, useContext, useEffect, useState } from 'react';
import { AuthUser, ADMIN_EMAIL } from '../types';
import { loginWithGoogle, loginAsViewer, logoutUser, subscribeToAuthState, isUserAdmin } from '../services/authService';

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  isAdmin: boolean;
  error: string | null;
  login: () => Promise<void>;
  loginAsViewer: () => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Listen to Firebase or mock auth state changes
    const unsubscribe = subscribeToAuthState((currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async () => {
    setError(null);
    try {
      const loggedUser = await loginWithGoogle();
      setUser(loggedUser);
    } catch (err: any) {
      setError(err?.message || 'Login gagal.');
      throw err;
    }
  };

  const loginViewer = async () => {
    setError(null);
    try {
      const loggedUser = await loginAsViewer();
      setUser(loggedUser);
    } catch (err: any) {
      setError(err?.message || 'Login penonton gagal.');
      throw err;
    }
  };

  const logout = async () => {
    setError(null);
    try {
      await logoutUser();
      setUser(null);
    } catch (err: any) {
      setError(err?.message || 'Logout gagal.');
      throw err;
    }
  };

  const clearError = () => setError(null);

  const isAdmin = isUserAdmin(user);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAdmin,
        error,
        login,
        loginAsViewer: loginViewer,
        logout,
        clearError
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuthContext(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider');
  }
  return context;
}
