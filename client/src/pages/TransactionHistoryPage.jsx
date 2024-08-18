import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom'; // Importera useLocation för att få åtkomst till state
import LogoutButton from '../components/LogoutButton';
import GoBackButton from '../components/GoBackButton';

const TransactionHistoryPage = () => {
  const [transactions, setTransactions] = useState([]);
  const location = useLocation(); // Använd useLocation för att få åtkomst till state

  useEffect(() => {
    // Hämta användarens transaktionshistorik från backend
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
      {/* Visa framgångsmeddelandet om det finns */}
      {location.state?.successMessage && (
        <div style={{ padding: '10px', backgroundColor: '#d4edda', color: '#155724', borderRadius: '4px', marginBottom: '20px' }}>
          {location.state.successMessage}
        </div>
      )}
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
