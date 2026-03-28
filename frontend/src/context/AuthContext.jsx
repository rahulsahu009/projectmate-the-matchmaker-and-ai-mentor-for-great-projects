import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Migration check: clean up old 'user' object if it was there
    localStorage.removeItem('user'); 
    
    const storedAuthStr = localStorage.getItem('auth_data');
    if (storedAuthStr) {
      try {
        const storedAuth = JSON.parse(storedAuthStr);
        setUser(storedAuth.user);
      } catch (e) {
        console.error("Failed to parse user session.");
      }
    }
    setLoading(false);
  }, []);

  const login = (authData) => {
    // authData from backend is { token: '...', user: {...} }
    localStorage.setItem('auth_data', JSON.stringify(authData));
    setUser(authData.user);
  };

  const logout = () => {
    localStorage.removeItem('auth_data');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuth: !!user, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
