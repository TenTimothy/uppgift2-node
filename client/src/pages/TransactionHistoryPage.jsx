import React, { useState, useEffect } from 'react';
import LogoutButton from '../components/LogoutButton';
import GoBackButton from '../components/GoBackButton';

const TransactionHistoryPage = () => {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      const response = await fetch('http://localhost:3001/api/v1/transactions');
      const data = await response.json();
      setTransactions(data.transactions);
    };

    fetchTransactions();
  }, []);

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <h2>Transaction History</h2>
      {transactions.length > 0 ? (
        <ul>
          {transactions.map((transaction, index) => (
            <li key={index} style={{ marginBottom: '10px', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}>
              <p><strong>To:</strong> {transaction.recipient}</p>
              <p><strong>Amount:</strong> {transaction.amount}</p>
              <p><strong>Date:</strong> {new Date(transaction.date).toLocaleString()}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No transactions found.</p>
      )}
      <LogoutButton /> 
      <GoBackButton /> 
    </div>
  );
};

export default TransactionHistoryPage;
