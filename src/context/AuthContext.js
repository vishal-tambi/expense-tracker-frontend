import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Check if the user is logged in on app load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get('https://expense-tracker-backend-pi-one.vercel.app/api/auth/check', { withCredentials: true });
        setUser(response.data.user);
      } catch (err) {
        setUser(null);
      }
    };
    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axios.post(
        'https://expense-tracker-backend-pi-one.vercel.app/api/auth/login',
        { email, password },
        { withCredentials: true }
      );
      setUser(response.data);
      return response.data;
    } catch (err) {
      throw err.response.data.message;
    }
  };

  const logout = async () => {
    try {
      await axios.post('https://expense-tracker-backend-pi-one.vercel.app/api/auth/logout', {}, { withCredentials: true });
      setUser(null); // Clear the user state
    } catch (err) {
      console.error(err.response.data.message);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };