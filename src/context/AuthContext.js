import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Check if the user is logged in on app load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem('token'); // Get the token from localStorage
        if (token) {
          const response = await axios.get(
            'https://expense-tracker-backend-pi-one.vercel.app/api/auth/check',
            {
              headers: {
                Authorization: `Bearer ${token}`, // Include the token in the headers
              },
              withCredentials: true,
            }
          );
          setUser(response.data.user); // Set the user state
        }
      } catch (err) {
        console.error('Auth Check Error:', err.response ? err.response.data : err.message);
        setUser(null); // Clear the user state if not authenticated
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
      console.log('Login Response:', response); // Log the response

      if (response.data.token) {
        localStorage.setItem('token', response.data.token); // Store the token in localStorage
      }

      setUser(response.data.user); // Set the user state
      return response.data;
    } catch (err) {
      console.error('Login Error:', err.response ? err.response.data : err.message);
      throw new Error(err.response?.data?.message || 'Login failed. Please try again.');
    }
  };

  const logout = async () => {
    try {
      await axios.post(
        'https://expense-tracker-backend-pi-one.vercel.app/api/auth/logout',
        {},
        { withCredentials: true }
      );
      setUser(null); // Clear the user state
      localStorage.removeItem('token'); // Remove the token from localStorage
    } catch (err) {
      console.error('Logout Error:', err.response ? err.response.data : err.message);
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };