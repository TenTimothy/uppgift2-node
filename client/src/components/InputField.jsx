import React from 'react';

const InputField = ({ label, type, value, onChange, placeholder }) => {
  return (
    <div style={{ marginBottom: '10px' }}>
      <label>{label}</label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required
        style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
      />
    </div>
  );
};

export default InputField;
