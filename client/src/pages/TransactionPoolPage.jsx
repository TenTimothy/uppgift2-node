import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; 
import LogoutButton from '../components/LogoutButton';
import GoBackButton from '../components/GoBackButton';

const TransactionPoolPage = () => {
  const [transactions, setTransactions] = useState([]);
  const [mining, setMining] = useState(false);
  const navigate = useNavigate(); 

  useEffect(() => {
    const fetchTransactionPool = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/v1/transaction-pool');
        const data = await response.json();
        setTransactions(data.data || []);
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
      const response = await fetch('http://localhost:3001/api/v1/blockchain/mine', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ minerAddress }),
      });

      const data = await response.json();
      if (data.success) {
        console.log('Block mined successfully:', data.data);
        setTransactions([]); 
        navigate('/transaction-history', { state: { successMessage: 'Block mined successfully!' } });
      } else {
        console.error('Error mining block:', data.error);
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
          {transactions.map((transaction) => (
            <li key={transaction.id} style={{ marginBottom: '10px', padding: '15px', border: '1px solid #ccc', borderRadius: '4px', textAlign: 'left', fontWeight: 'bold' }}> 
              <p><strong>Transaction ID:</strong> {transaction.id}</p>
              <p><strong>Sender:</strong> {transaction.sender || 'N/A'}</p>
              <p><strong>Recipient:</strong> {transaction.recipient || 'N/A'}</p>
              <p><strong>Amount:</strong> {transaction.amount || 'N/A'}</p>
            </li>
          ))}
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
