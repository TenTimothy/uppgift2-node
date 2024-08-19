import React from 'react';
import { Link } from 'react-router-dom';
import LogoutButton from '../components/LogoutButton';

const HomePage = () => {
  return (
    <div style={{ textAlign: 'center', marginTop: '-90px' }}>
      <h1>Welcome to Sonic-Chain</h1>
      <nav style={{ marginTop: '20px' }}>
        <Link to="/send-transaction" style={linkStyle}>Send Transaction</Link>
        <Link to="/transaction-history" style={linkStyle}>Transaction History</Link>
        <Link to="/transaction-pool" style={linkStyle}>Transaction Pool</Link> 
      </nav>
      <LogoutButton />
    </div>
  );
};

const linkStyle = {
  display: 'inline-block',
  margin: '0 15px',
  padding: '10px 20px',
  backgroundColor: 'white',
  color: 'black',
  borderRadius: '4px',
  textDecoration: 'none',
};

export default HomePage;
