import React, { useState } from 'react';
import { Button, Input, FormContainer } from './styledComponents';

const TransactionForm = () => {
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    const response = await fetch('/api/v1/transactions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ recipient, amount }),
    });

    const data = await response.json();
    console.log('Transaction submitted:', data);
  };

  return (
    <FormContainer>
      <h3>Create Transaction</h3>
      <form onSubmit={handleSubmit}>
        <Input
          type="text"
          placeholder="Recipient Address"
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
        />
        <Input
          type="number"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <Button type="submit">Send</Button>
      </form>
    </FormContainer>
  );
};

export default TransactionForm;
