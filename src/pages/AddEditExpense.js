import React, { useState, useEffect, useContext } from 'react';
import { TextField, Button, Container, Typography } from '@mui/material';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const AddEditExpense = () => {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useContext(AuthContext);

  useEffect(() => {
    if (id) {
      const fetchExpense = async () => {
        try {
          const token = localStorage.getItem('token'); // Get the token from localStorage
          const response = await axios.get(`https://expense-tracker-backend-1t2o.onrender.com/api/expenses/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`, // Include the token in the headers
            },
            withCredentials: true,
          });
          const { amount, category, date, description } = response.data;
          setAmount(amount);
          setCategory(category);
          setDate(date);
          setDescription(description);
        } catch (err) {
          console.error('Error fetching expense:', err.response ? err.response.data : err.message);
        }
      };
      fetchExpense();
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const expenseData = { amount, category, date, description };
    try {
      const token = localStorage.getItem('token'); // Get the token from localStorage
      if (id) {
        // Update existing expense
        await axios.put(
          `https://expense-tracker-backend-1t2o.onrender.com/api/expenses/${id}`,
          expenseData,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Include the token in the headers
            },
            withCredentials: true,
          }
        );
      } else {
        // Add new expense
        await axios.post(
          'https://expense-tracker-backend-1t2o.onrender.com/api/expenses',
          expenseData,
          {
            headers: {
              Authorization: `Bearer ${token}`, // Include the token in the headers
            },
            withCredentials: true,
          }
        );
      }
      navigate('/dashboard'); // Redirect to the dashboard after adding/editing the expense
    } catch (err) {
      console.error('Error adding/editing expense:', err.response ? err.response.data : err.message);
    }


  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>
        {id ? 'Edit Expense' : 'Add Expense'}
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="Amount"
          type="number"
          fullWidth
          margin="normal"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
        <TextField
          label="Category"
          fullWidth
          margin="normal"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
        />
        <TextField
          label="Date"
          type="date"
          fullWidth
          margin="normal"
          InputLabelProps={{ shrink: true }}
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />
        <TextField
          label="Description"
          fullWidth
          margin="normal"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <Button type="submit" variant="contained" color="primary" fullWidth>
          {id ? 'Update Expense' : 'Add Expense'}
        </Button>
      </form>
    </Container>
  );
};

export default AddEditExpense;