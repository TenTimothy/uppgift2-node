import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthForm from '../components/AuthForm';
import ToggleButton from '../components/ToggleButton';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      setIsAuthenticated(true);
      navigate('/home'); 
    }
  }, [navigate]);

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
        localStorage.setItem('authToken', data.token);  
        setIsAuthenticated(true);
        navigate('/home');
      } else {
        console.error('Error during authentication', data.message);
      }
    } catch (error) {
      console.error('An unexpected error occurred:', error);
    }
  };


  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h1 style={{ marginTop: '-30px', color: 'white' }}>Sonic-Chain</h1> 
      <div style={{ maxWidth: '400px', margin: '20px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '4px'}}>
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
      <h2 style={{ marginTop: '30px', color: 'white' }}>Sound Together</h2> 
    </div>
  );
};

export default AuthPage;
