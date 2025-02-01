import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Check if the user is logged in on app load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get('https://expense-tracker-backend-1t2o.onrender.com/api/auth/check', { withCredentials: true });
        setUser(response.data.user); // Set the user state
      } catch (err) {
        setUser(null); // Clear the user state if not authenticated
      }
    };
    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axios.post('https://expense-tracker-backend-1t2o.onrender.com/api/auth/login', { email, password }, { withCredentials: true });

      // Check if the response contains an error
      if (response.data.error) {
        throw new Error(response.data.error);
      }

      const userData = response.data;

      // Store user data in state and localStorage
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));

      return userData;
    } catch (error) {
      console.error('Login Error:', error.response ? error.response.data : error.message);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await axios.post('https://expense-tracker-backend-1t2o.onrender.com/api/auth/logout', {}, { withCredentials: true });
      setUser(null);
      localStorage.removeItem('user');
    } catch (err) {
      console.error('Logout Error:', err.response ? err.response.data.message : err.message);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
