// AuthPage.jsx
import React, { useState } from 'react';
import { FormContainer, Input, Button, AuthFormWrapper, AuthTitle, SwitchAuthLink } from './styledComponents';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const toggleAuthMode = () => {
    setIsLogin((prevMode) => !prevMode);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const url = isLogin ? '/api/v1/auth/login' : '/api/v1/auth/register';

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
      // Spara token och användarinformation, och navigera till nästa sida
      console.log('Login/Register successful', data);
    } else {
      // Hantera fel
      console.error('Error during authentication', data.error);
    }
  };

  return (
    <AuthFormWrapper>
      <AuthTitle>{isLogin ? 'Login' : 'Register'}</AuthTitle>
      <FormContainer onSubmit={handleSubmit}>
        {!isLogin && <Input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} required />}
        <Input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <Input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <Button type="submit">{isLogin ? 'Login' : 'Register'}</Button>
      </FormContainer>
      <SwitchAuthLink onClick={toggleAuthMode}>
        {isLogin ? "Don't have an account? Register here" : 'Already have an account? Login here'}
      </SwitchAuthLink>
    </AuthFormWrapper>
  );
};

export default AuthPage;
