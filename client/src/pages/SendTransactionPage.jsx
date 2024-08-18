import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LogoutButton from '../components/LogoutButton';
import GoBackButton from '../components/GoBackButton';

const SendTransactionPage = () => {
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const navigate = useNavigate(); // Hook för att navigera mellan sidor

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch('http://localhost:3001/api/v1/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          recipient,
          amount,
        }),
      });

      const data = await response.json();
      if (data.success) {
        console.log('Transaction sent successfully:', data.data);
        navigate('/transaction-pool'); // Navigera till TransactionPoolPage efter att transaktionen har skickats
      } else {
        console.error('Error sending transaction:', data.error);
      }
    } catch (error) {
      console.error('An unexpected error occurred:', error);
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto', padding: '20px' }}>
      <h2>Send Transaction</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '10px' }}>
          <label>Recipient Address</label>
          <input
            type="text"
            value={recipient}
            onChange={(e) => setRecipient(e.target.value)}
            required
            style={inputStyle}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>Amount</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            style={inputStyle}
          />
        </div>
        <button type="submit" style={buttonStyle}>Send</button>
      </form>
      <LogoutButton />
      <GoBackButton />
    </div>
  );
};

const inputStyle = {
  width: '100%',
  padding: '8px',
  boxSizing: 'border-box',
  marginBottom: '10px',
};

const buttonStyle = {
  width: '100%',
  padding: '10px',
  backgroundColor: '#007BFF',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
};

export default SendTransactionPage;
