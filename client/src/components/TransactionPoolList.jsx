import React, { useEffect, useState } from 'react';
import { ListContainer, SectionTitle, TransactionCard } from './styledComponents';

const TransactionPoolList = () => {
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    const fetchTransactions = async () => {
      const response = await fetch('/api/v1/transaction-pool');
      const data = await response.json();
      setTransactions(data.data);
    };

    fetchTransactions();
  }, []);

  return (
    <ListContainer>
      <SectionTitle>Transaction Pool</SectionTitle>
      {transactions.map((transaction, index) => (
        <TransactionCard key={index}>
          <p><strong>ID:</strong> {transaction.id}</p>
          <p><strong>Amount:</strong> {transaction.amount}</p>
          <p><strong>Recipient:</strong> {transaction.recipient}</p>
        </TransactionCard>
      ))}
    </ListContainer>
  );
};

export default TransactionPoolList;
