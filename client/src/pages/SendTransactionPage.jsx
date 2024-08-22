import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LogoutButton from '../components/LogoutButton';
import GoBackButton from '../components/GoBackButton';

const inputStyle = {
  width: '100%',
  padding: '10px',
  backgroundColor: 'white',
  color: 'black',
  border: '1px solid #ccc',
  borderRadius: '4px',
  boxSizing: 'border-box', 
  fontWeight: 'bold',  
};

const buttonStyle = {
  width: '100%',
  padding: '10px',
  backgroundColor: 'white',
  color: 'black',
  border: '1px solid #ccc',
  borderRadius: '4px',
  cursor: 'pointer',
  boxSizing: 'border-box',  
};

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

const SendTransactionPage = () => {
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const navigate = useNavigate(); 

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const token = localStorage.getItem('authToken');
      const decodedToken = parseJwt(token);  
      const senderPublicKey = decodedToken.publicKey; 

      const response = await fetch('http://localhost:3001/api/v1/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`  
        },
        body: JSON.stringify({
          sender: senderPublicKey,  
          recipient,
          amount: parseFloat(amount), 
        }),
      });

      const data = await response.json();
      if (data.success) {
        console.log('Transaction sent successfully:', data.data);
        navigate('/transaction-pool'); 
      } else {
        console.error('Error sending transaction:', data.message);
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

export default SendTransactionPage;
