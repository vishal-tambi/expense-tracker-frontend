import React from 'react';
import { BarChart } from '@mui/x-charts';

const SpendingChart = ({ expenses }) => {
  const categories = [...new Set(expenses.map((expense) => expense.category))];
  const data = categories.map((category) => ({
    category,
    total: expenses
      .filter((expense) => expense.category === category)
      .reduce((sum, expense) => sum + expense.amount, 0),
  }));

  return (
    <BarChart
      xAxis={[{ scaleType: 'band', data: data.map((d) => d.category) }]}
      series={[{ data: data.map((d) => d.total) }]}
      height={300}
    />
  );
};

export default SpendingChart;