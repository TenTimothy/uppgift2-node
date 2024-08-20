import React from 'react';
import { Link } from 'react-router-dom';
import LogoutButton from '../components/LogoutButton';

const HomePage = () => {
  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h1>Welcome to Sonic-Chain</h1>
      <nav style={navStyle}>
        <Link to="/send-transaction" style={linkStyle}>Send Transaction</Link>
        <Link to="/transaction-pool" style={linkStyle}>Transaction Pool</Link>
        <Link to="/transaction-history" style={linkStyle}>Transaction History</Link>
      </nav>
      <LogoutButton />
    </div>
  );
};

const navStyle = {
  display: 'flex',
  flexDirection: 'column', 
  alignItems: 'center',  
  gap: '15px', 
  marginTop: '20px',
};

const linkStyle = {
  display: 'block',
  padding: '10px 20px',
  backgroundColor: 'white',
  color: 'black',
  borderRadius: '4px',
  textDecoration: 'none',
  width: '100%', 
  maxWidth: '200px', 
  textAlign: 'center',
};

export default HomePage;
