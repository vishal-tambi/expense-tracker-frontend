import React, { useState, useContext } from 'react';
import { TextField, Button, Container, Typography, Link } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password); // Use the login function from AuthContext
      navigate('/dashboard'); // Redirect to the dashboard after successful login
    } catch (err) {
      alert(err); // Show error message if login fails
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>
        Login
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Email"
          type="email"
          fullWidth
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          label="Password"
          type="password"
          fullWidth
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Login
        </Button>
      </form>
      <Typography variant="body1" align="center" style={{ marginTop: '16px' }}>
        Don't have an account?{' '}
        <Link href="/register" underline="hover">
          Register Yourself
        </Link>
      </Typography>
    </Container>
  );
};

export default Login;