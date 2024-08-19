import React from 'react';

const InputField = ({ label, type, value, onChange, placeholder }) => {
  return (
    <div style={{ marginBottom: '10px' }}>
      <label style={{ color: '#ffffff', fontWeight: 'bold' }}>{label}</label> {/* Ändra etikettens färg här */}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required
        style={{
          width: '100%',
          padding: '10px',
          boxSizing: 'border-box',
          marginBottom: '10px',
          backgroundColor: 'white', 
          color: '#ffffff', 
          border: '1px solid #555', 
          borderRadius: '4px',
          fontSize: '16px',
        }}
      />
    </div>
  );
};

export default InputField;
