import React from 'react';
import { useNavigate } from 'react-router-dom';

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    navigate('/auth');
  };

  return (
    <button 
      onClick={handleLogout} 
      style={logoutButtonStyle}
    >
      Logout
    </button>
  );
};
s
const logoutButtonStyle = {
  position: 'fixed',
  top: '10px',
  right: '10px',
  padding: '10px 20px',
  backgroundColor: 'white',
  color: 'black',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
};

export default LogoutButton;
