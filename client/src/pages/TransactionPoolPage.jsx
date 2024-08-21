import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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

const TransactionPoolPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [mining, setMining] = useState(false);
  const [senderName, setSenderName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTransactionPool = async () => {
      try {
        const token = localStorage.getItem('authToken');
        const decodedToken = parseJwt(token);

        console.log('Decoded JWT:', decodedToken);

        if (decodedToken && decodedToken.name) {
          setSenderName(decodedToken.name);
        } else {
          setSenderName('Unknown');
        }

        const response = await fetch('http://localhost:3001/api/v1/transaction-pool', {
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        });
        const data = await response.json();
        if (data.success) {
          setTransactions(Object.values(data.data) || []);
        } else {
          console.error('Failed to fetch transaction pool:', data.message);
        }
      } catch (error) {
        console.error('Error fetching transaction pool:', error);
      }
    };

    fetchTransactionPool();
  }, []);

  const handleMineBlock = async () => {
    setMining(true);
    try {
      const minerAddress = 'your-miner-address';
      const token = localStorage.getItem('authToken');
      const response = await fetch('http://localhost:3001/api/v1/blockchain/mine', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ minerAddress }),
      });

      const data = await response.json();
      if (data.success) {
        console.log('Block mined successfully:', data.data);
        setTransactions([]);
        navigate('/transaction-history', { state: { successMessage: 'Block mined successfully!' } });
      } else {
        console.error('Error mining block:', data.message);
      }
    } catch (error) {
      console.error('An unexpected error occurred:', error);
    } finally {
      setMining(false);
    }
  };

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px', textAlign: 'center' }}>
      <h2>Transaction Pool</h2>
      {transactions.length > 0 ? (
        <ul style={{ padding: '0', listStyleType: 'none' }}>
          {transactions.map((transaction) => {
            const sender = transaction.inputMap.address;
            return Object.entries(transaction.outputMap)
              .filter(([recipient, _]) => recipient !== sender)
              .map(([recipient, amount], index) => (
                <li key={`${transaction.id}-${index}`} style={{
                  marginBottom: '10px',
                  padding: '15px',
                  border: '1px solid #ccc',
                  borderRadius: '4px',
                  textAlign: 'left',
                  fontWeight: 'bold',
                  wordWrap: 'break-word',
                  overflowWrap: 'break-word',
                }}>
                  <p><strong>Transaction ID:</strong> {transaction.id}</p>
                  <p><strong>Sender Address:</strong> {sender}</p>
                  <p><strong>Sender Name:</strong> {senderName}</p>
                  <p><strong>Recipient:</strong> {recipient}</p>
                  <p><strong>Amount Sent:</strong> {amount}</p>
                  <p><strong>Remaining Balance:</strong> {transaction.outputMap[sender]}</p>
                </li>
              ));
          })}
        </ul>
      ) : (
        <p>No transactions in the pool.</p>
      )}
      <button
        onClick={handleMineBlock}
        disabled={mining || transactions.length === 0}
        style={{
          padding: '10px 20px',
          backgroundColor: 'white',
          color: 'black',
          border: '1px solid #ccc',
          borderRadius: '4px',
          cursor: 'pointer',
          margin: '20px auto',
          display: 'block',
        }}
      >
        {mining ? 'Mining...' : 'Mine Block'}
      </button>
      <LogoutButton />
      <GoBackButton />
    </div>
  );
};

export default TransactionPoolPage;
