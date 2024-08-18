import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import LogoutButton from '../components/LogoutButton';
import GoBackButton from '../components/GoBackButton';

const TransactionHistoryPage = () => {
  const [transactions, setTransactions] = useState([]);
  const location = useLocation();

  useEffect(() => {
    const fetchBlockchain = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/v1/blockchain');
        const data = await response.json();

        console.log('Fetched blockchain:', data.blockchain);
        
        // Extrahera alla transaktioner från varje block i blockkedjan
        const allTransactions = data.blockchain.flatMap(block => 
          block.data.map(transaction => ({
            ...transaction,
            blockHash: block.hash,  // Lägg till blockets hash för att visa detta
            timestamp: block.timestamp // Lägg till blockets timestamp
          }))
        );

        setTransactions(allTransactions);
      } catch (error) {
        console.error('Error fetching transaction history:', error);
      }
    };

    fetchBlockchain();
  }, []);

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px' }}>
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
              <p><strong>Date:</strong> {new Date(transaction.timestamp).toLocaleString()}</p>
              <p><strong>Timestamp:</strong> {transaction.timestamp}</p>
              <p><strong>Block Hash:</strong> {transaction.blockHash}</p>
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
