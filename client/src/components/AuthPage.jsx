import React, { useState } from 'react';

const AuthPage = () => {
  console.log('AuthPage component rendered');

  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const toggleAuthMode = () => {
    setIsLogin((prevMode) => !prevMode);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log('Form submitted!');
    
    const url = isLogin ? '/api/v1/auth/login' : '/api/v1/auth/register';
    
    try {
      const response = await fetch(`http://localhost:3001${url}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          ...(isLogin ? {} : { name }),
        }),
      });
  
      console.log('Fetch completed:', response); // Logga hela svaret
  
      const data = await response.json();
      console.log('Response data:', data);
  
      if (data.success) {
        console.log('Login/Register successful', data);
      } else {
        console.error('Error during authentication', data.error);
      }
    } catch (error) {
      console.error('An unexpected error occurred:', error);
    }
  };
  
  return (
    <div style={{ maxWidth: '400px', margin: '0 auto', padding: '20px', border: '1px solid #ccc', borderRadius: '4px' }}>
      <h1>{isLogin ? 'Login' : 'Register'}</h1>
      <form onSubmit={handleSubmit}>
        {!isLogin && (
          <div style={{ marginBottom: '10px' }}>
            <label>Name</label>
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
            />
          </div>
        )}
        <div style={{ marginBottom: '10px' }}>
          <label>Email</label>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>
        <div style={{ marginBottom: '10px' }}>
          <label>Password</label>
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
          />
        </div>
        <button
          type="submit"
          style={{
            width: '100%',
            padding: '10px',
            backgroundColor: '#007BFF',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
          }}
        >
          {isLogin ? 'Login' : 'Register'}
        </button>
      </form>
      <div style={{ marginTop: '10px', textAlign: 'center' }}>
        <button
          onClick={toggleAuthMode}
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
    </div>
  );
};

export default AuthPage;
