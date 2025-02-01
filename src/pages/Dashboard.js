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

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/expenses', { withCredentials: true });
        setExpenses(response.data.expenses); // Set the expenses state
      } catch (err) {
        console.error(err.response.data.message);
      }
    };
    fetchExpenses();
  }, []);

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