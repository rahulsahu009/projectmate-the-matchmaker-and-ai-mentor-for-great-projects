import React, { createContext, useState, useEffect, useContext } from 'react';
import api from '../api/axiosConfig';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Migration sweep from previous auth_data bundled approach
    localStorage.removeItem('user'); 
    localStorage.removeItem('auth_data');
    
    const storedUserStr = localStorage.getItem('user_profile');
    const token = localStorage.getItem('jwt_token');
    
    if (storedUserStr && token) {
      try {
        const storedUser = JSON.parse(storedUserStr);
        setUser(storedUser);
      } catch (e) {
        console.error("Failed to parse user profile context.");
      }
    }
    setLoading(false);
  }, []);

  const login = (authData) => {
    // Decouples explicitly tracking 'jwt_token' string vs 'user_profile' JSON block
    const { token, ...userData } = authData;
    localStorage.setItem('jwt_token', token);
    localStorage.setItem('user_profile', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('jwt_token');
    localStorage.removeItem('user_profile');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuth: !!user, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
