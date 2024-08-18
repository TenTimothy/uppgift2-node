import React, { useState, useEffect } from 'react';
import AuthForm from '../components/AuthForm';
import ToggleButton from '../components/ToggleButton';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Kolla om det finns en token i localStorage vid sidladdning
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const toggleAuthMode = () => {
    setIsLogin((prevMode) => !prevMode);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
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
  
      const data = await response.json();
  
      if (data.success) {
        // Spara token i localStorage
        localStorage.setItem('authToken', data.token);
        setIsAuthenticated(true);
        console.log('Login/Register successful', data);
      } else {
        console.error('Error during authentication', data.error);
      }
    } catch (error) {
      console.error('An unexpected error occurred:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setIsAuthenticated(false);
  };

  if (isAuthenticated) {
    return (
      <div style={{ textAlign: 'center', marginTop: '50px' }}>
        <h2>Welcome Back!</h2>
        <button onClick={handleLogout} style={{
          padding: '10px 20px',
          backgroundColor: '#007BFF',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
        }}>Logout</button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '400px', margin: '0 auto', padding: '20px', border: '1px solid #ccc', borderRadius: '4px' }}>
      <h1>{isLogin ? 'Login' : 'Register'}</h1>
      <AuthForm
        isLogin={isLogin}
        name={name}
        email={email}
        password={password}
        setName={setName}
        setEmail={setEmail}
        setPassword={setPassword}
        handleSubmit={handleSubmit}
      />
      <ToggleButton isLogin={isLogin} onClick={toggleAuthMode} />
    </div>
  );
};

export default AuthPage;
