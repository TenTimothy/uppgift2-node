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

const logoutButtonStyle = {
  position: 'fixed',
  top: '10px',
  right: '10px',
  padding: '10px 20px',
  backgroundColor: '#dc3545',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
};

export default LogoutButton;
