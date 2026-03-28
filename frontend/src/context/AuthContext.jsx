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
        // Flatten extraction
        const parsedUser = storedAuth.user ? storedAuth.user : (({ token, ...rest }) => rest)(storedAuth);
        setUser(parsedUser);
      } catch (e) {
        console.error("Failed to parse user session.");
      }
    }
    setLoading(false);
  }, []);

  const login = (authData) => {
    // Dynamically store unified or flattened structure
    const parsedUser = authData.user ? authData.user : (({ token, ...rest }) => rest)(authData);
    localStorage.setItem('auth_data', JSON.stringify({ token: authData.token, ...parsedUser }));
    setUser(parsedUser);
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
