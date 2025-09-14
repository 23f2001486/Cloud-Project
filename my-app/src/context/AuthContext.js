import React, { createContext, useContext, useState, useEffect } from 'react';
import { getAuthStatus } from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check for an existing session on app load
  useEffect(() => {
    const checkSession = async () => {
      try {
        const res = await getAuthStatus();
        setUser(res.data.user);
      } catch (err) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    checkSession();
  }, []);

  const login = (userData) => setUser(userData);
  const logout = () => setUser(null);

  if (loading) {
    return <div>Loading...</div>; // Or a better loading spinner
  }

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);