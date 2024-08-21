import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import LogoutButton from '../components/LogoutButton';
import GoBackButton from '../components/GoBackButton';

const parseJwt = (token) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    return JSON.parse(atob(base64));
  } catch (error) {
    console.error('Failed to parse JWT:', error);
    return null;
  }
};

const TransactionHistoryPage = () => {
  const [blocks, setBlocks] = useState([]);
  const location = useLocation();
  const [senderName, setSenderName] = useState('');

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const decodedToken = parseJwt(token);

    if (decodedToken && decodedToken.name) {
      setSenderName(decodedToken.name);
    } else {
      setSenderName('Unknown');
    }

    const fetchBlockchain = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/v1/blockchain', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await response.json();

        if (data.success && Array.isArray(data.data)) {
          setBlocks(data.data);
        } else {
          console.error('Error fetching transaction history: Invalid data format');
        }
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
      {blocks.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '8px' }}>
          {blocks.map((block, index) => (
            <div key={index} style={{
              padding: '16px',
              border: '1px solid #ccc',
              borderRadius: '6px',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
              backgroundColor: '#f9f9f9',
              color: 'black',
              textAlign: 'left',
              fontSize: '0.9em',
              wordWrap: 'break-word',
            }}>
              <h4 style={{ marginBottom: '8px' }}>Block Hash: {block.hash}</h4>
              <p><strong>Date:</strong> {new Date(block.timestamp).toLocaleString()}</p>
              <p><strong>Transactions:</strong></p>
              <ul style={{ listStyleType: 'none', padding: 0 }}>
                {block.data.map((transaction, tIndex) => {
                  const sender = transaction.inputMap?.address || 'N/A';
                  return (
                    <li key={`${transaction.id}-${tIndex}`} style={{ marginBottom: '8px' }}>
                      <p><strong>Transaction ID:</strong> {transaction.id}</p>
                      <p><strong>Sender Address:</strong> {sender}</p>
                      <ul style={{ paddingLeft: '16px' }}>
                        {Object.entries(transaction.outputMap)
                          .filter(([recipient, _]) => recipient !== sender)
                          .map(([recipient, amount], rIndex) => (
                            <li key={`${recipient}-${rIndex}`}>
                              <p><strong>Reward Amount:</strong> {amount}</p>
                              <p><strong>Recipient:</strong> {recipient}</p>
                            </li>
                          ))}
                      </ul>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
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
