// src/components/Card.jsx
import React from 'react';
import styled from 'styled-components';

const CardContainer = styled.div`
  background-color: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  max-width: 400px;
  margin: 20px auto;
`;

const CardTitle = styled.h2`
  margin: 0 0 10px;
  font-size: 24px;
  color: #333;
`;

const CardContent = styled.p`
  font-size: 16px;
  color: #666;
`;

const Card = ({ title, content }) => {
  return (
    <CardContainer>
      <CardTitle>{title}</CardTitle>
      <CardContent>{content}</CardContent>
    </CardContainer>
  );
};

export default Card;
