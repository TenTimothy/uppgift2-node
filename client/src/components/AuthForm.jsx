import React from 'react';
import InputField from './InputField'; 

const AuthForm = ({ isLogin, name, email, password, setName, setEmail, setPassword, handleSubmit }) => {
  return (
    <form onSubmit={handleSubmit}>
      {!isLogin && (
        <InputField
          label="Name"
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      )}
      <InputField
        label="Email"
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <InputField
        label="Password"
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button
          type="submit"
          style={{
          width: '100%',
          padding: '10px',
          background: 'white',
          color: 'black',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
  
        }}
      >
        {isLogin ? 'Login' : 'Register'}
      </button>
    </form>
  );
};

export default AuthForm;
