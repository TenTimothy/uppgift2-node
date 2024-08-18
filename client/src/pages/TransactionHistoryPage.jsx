import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import LogoutButton from '../components/LogoutButton';
import GoBackButton from '../components/GoBackButton';

const TransactionHistoryPage = () => {
  const [transactions, setTransactions] = useState([]);
  const location = useLocation();

  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/v1/blockchain');
        const data = await response.json();

        console.log('Fetched transactions:', data.transactions);
        setTransactions(data.transactions || []);
      } catch (error) {
        console.error('Error fetching transaction history:', error);
      }
    };

    fetchTransactions();
  }, []);

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <h2>Transaction History</h2>
      {location.state?.successMessage && (
        <div style={{ padding: '10px', backgroundColor: '#d4edda', color: '#155724', borderRadius: '4px', marginBottom: '20px' }}>
          {location.state.successMessage}
        </div>
      )}
      {transactions.length > 0 ? (
        <ul>
          {transactions.map((transaction, index) => (
            <li key={index} style={{ marginBottom: '10px', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}>
              <p><strong>Transaction ID:</strong> {transaction.id}</p>
              <p><strong>Sender:</strong> {transaction.inputMap?.address || 'N/A'}</p>
              <p><strong>Recipient:</strong> {Object.keys(transaction.outputMap).find(addr => addr !== transaction.inputMap?.address)}</p>
              <p><strong>Amount:</strong> {Object.values(transaction.outputMap).reduce((a, b) => b !== transaction.inputMap?.amount ? b : a, 0)}</p>
              <p><strong>Date:</strong> {new Date(transaction.inputMap?.timestamp).toLocaleString()}</p>
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
