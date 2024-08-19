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
        
        
        const allTransactions = data.blockchain.flatMap(block => 
          block.data.map(transaction => ({
            ...transaction,
            blockHash: block.hash, 
            timestamp: block.timestamp 
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
          {transactions.map((transaction, index) => {
            const sender = transaction.inputMap?.address || 'N/A';
            const recipient = Object.keys(transaction.outputMap).find(addr => addr !== sender);
            const amountSent = transaction.outputMap[recipient];
            const remainingBalance = transaction.outputMap[sender];

            return (
              <li key={index} style={{ marginBottom: '10px', padding: '10px', border: '1px solid #ccc', borderRadius: '4px' }}>
                <p><strong>Transaction ID:</strong> {transaction.id}</p>
                <p><strong>Sender:</strong> {sender}</p>
                <p><strong>Recipient:</strong> {recipient}</p>
                <p><strong>Amount Sent:</strong> {amountSent}</p>
                <p><strong>Remaining Balance:</strong> {remainingBalance !== undefined ? remainingBalance : 'N/A'}</p>
                <p><strong>Date:</strong> {new Date(transaction.timestamp).toLocaleString()}</p>
                <p><strong>Timestamp:</strong> {transaction.timestamp}</p>
                <p><strong>Block Hash:</strong> {transaction.blockHash}</p>
              </li>
            );
          })}
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
