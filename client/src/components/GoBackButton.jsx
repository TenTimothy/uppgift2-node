import React from 'react';
import { useNavigate } from 'react-router-dom';

const GoBackButton = () => {
  const navigate = useNavigate();

  return (
    <button 
      onClick={() => navigate('/home')} 
      style={goBackButtonStyle}
    >
      Go Back
    </button>
  );
};

const goBackButtonStyle = {
  position: 'fixed',
  top: '50px',
  left: '10px',
  padding: '10px 20px',
  backgroundColor: '#28a745',
  color: 'white',
  border: 'none',
  borderRadius: '4px',
  cursor: 'pointer',
};

export default GoBackButton;
