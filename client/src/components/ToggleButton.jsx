import React from 'react';

const ToggleButton = ({ isLogin, onClick }) => {
  return (
    <div style={{ marginTop: '10px', textAlign: 'center' }}>
      <button
        onClick={onClick}
        style={{
          backgroundColor: 'transparent',
          color: '#007BFF',
          border: 'none',
          cursor: 'pointer',
          textDecoration: 'underline',
        }}
      >
        {isLogin ? "Don't have an account? Register here" : 'Already have an account? Login here'}
      </button>
    </div>
  );
};

export default ToggleButton;
