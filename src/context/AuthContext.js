import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // Check if the user is logged in on app load
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.get('https://expense-tracker-backend-02sg.onrender.com/api/auth/check', {
          withCredentials: true, // Include cookies
        });
        if (response.data.user) {
          setUser(response.data.user); // Set the user state
        } else {
          setUser(null); // Clear the user state if no user is returned
        }
      } catch (err) {
        console.error('Auth check error:', err); // Log the error for debugging
        setUser(null); // Clear the user state if the request fails
      }
    };
    checkAuth();
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      const response = await axios.post(
        'https://expense-tracker-backend-02sg.onrender.com/api/auth/login',
        { email, password },
        { withCredentials: true } // Include cookies
      );
      setUser(response.data); // Set the user state
      navigate('/dashboard'); // Redirect to the dashboard after successful login
    } catch (err) {
      console.error('Login error:', err); // Log the error for debugging
      throw err.response?.data?.message || 'Login failed. Please try again.'; // Throw a user-friendly error
    }
  };

  // Logout function
  const logout = async () => {
    try {
      await axios.post(
        'https://expense-tracker-backend-02sg.onrender.com/api/auth/logout',
        {},
        { withCredentials: true } // Include cookies
      );
      setUser(null); // Clear the user state
      navigate('/login'); // Redirect to the login page after logout
    } catch (err) {
      console.error('Logout error:', err); // Log the error for debugging
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };