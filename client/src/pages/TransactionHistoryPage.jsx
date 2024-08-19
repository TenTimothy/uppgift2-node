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
    <div className="container">
      <h2>Transaction History</h2>
      {location.state?.successMessage && (
        <div style={{ padding: '8px', backgroundColor: '#d4edda', color: '#155724', borderRadius: '4px', marginBottom: '15px', textAlign: 'center' }}>
          {location.state.successMessage}
        </div>
      )}
      {transactions.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '8px' }}>
          {transactions.map((transaction, index) => {
            const sender = transaction.inputMap?.address || 'N/A';
            const recipient = Object.keys(transaction.outputMap).find(addr => addr !== sender);
            const amountSent = transaction.outputMap[recipient];
            const remainingBalance = transaction.outputMap[sender];
  
            return (
              <div key={index} style={{
                padding: '8px', 
                border: '1px solid #ccc',
                borderRadius: '6px', 
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                backgroundColor: '#f9f9f9',
                color: 'black',
                textAlign: 'left',
                fontSize: '0.9em',
                wordWrap: 'break-word',
              }}>
                <p><strong>Transaction ID:</strong> {transaction.id}</p>
                <p><strong>Sender:</strong> {sender}</p>
                <p><strong>Recipient:</strong> {recipient}</p>
                <p><strong>Amount Sent:</strong> {amountSent}</p>
                <p><strong>Remaining Balance:</strong> {remainingBalance !== undefined ? remainingBalance : 'N/A'}</p>
                <p><strong>Date:</strong> {new Date(transaction.timestamp).toLocaleString()}</p>
                <p><strong>Timestamp:</strong> {transaction.timestamp}</p>
                <p><strong>Block Hash:</strong> {transaction.blockHash}</p>
              </div>
            );
          })}
        </div>
      ) : (
        <p style={{ textAlign: 'center', color: 'black' }}>No transactions found.</p>
      )}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
        <LogoutButton />
        <GoBackButton />
      </div>
    </div>
  );  
};

export default TransactionHistoryPage;
