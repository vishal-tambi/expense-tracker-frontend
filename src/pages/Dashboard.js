import React, { useEffect, useState, useContext } from 'react';
import { Container, Typography, Button } from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ExpenseList from '../components/ExpenseList';
import SpendingChart from '../components/SpendingChart';
import { AuthContext } from '../context/AuthContext';

const Dashboard = () => {
  const [expenses, setExpenses] = useState([]);
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  // Log the user for debugging
  console.log('User:', user);

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const token = localStorage.getItem('token'); // Get the token from localStorage
        const response = await axios.get('https://expense-tracker-backend-1t2o.onrender.com/api/expenses', {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the headers
          },
          withCredentials: true,
        });
        console.log('Expenses Response:', response); // Log the response
        setExpenses(response.data.expenses); // Set the expenses state
      } catch (err) {
        console.error('Error fetching expenses:', err.response ? err.response.data : err.message);
      }
    };

    if (user) {
      fetchExpenses(); // Fetch expenses only if the user is authenticated
    } else {
      navigate('/login'); // Redirect to login if the user is not authenticated
    }
  }, [user, navigate]);

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Button variant="contained" color="primary" onClick={() => navigate('/add-expense')}>
        Add Expense
      </Button>
      <ExpenseList expenses={expenses} />
      <SpendingChart expenses={expenses} />
    </Container>
  );
};

export default Dashboard;