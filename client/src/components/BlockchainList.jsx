import React, { useEffect, useState } from 'react';
import { BlockCard, ListContainer, SectionTitle } from './styledComponents';

const BlockchainList = () => {
  const [chain, setChain] = useState([]);

  useEffect(() => {
    const fetchChain = async () => {
      const response = await fetch('/api/v1/blockchain');
      const data = await response.json();
      setChain(data.data);
    };

    fetchChain();
  }, []);

  return (
    <ListContainer>
      <SectionTitle>Blockchain</SectionTitle>
      {chain.map((block, index) => (
        <BlockCard key={index}>
          <p><strong>Index:</strong> {index}</p>
          <p><strong>Timestamp:</strong> {block.timestamp}</p>
          <p><strong>Data:</strong> {JSON.stringify(block.data)}</p>
          <p><strong>Hash:</strong> {block.hash}</p>
          <p><strong>Previous Hash:</strong> {block.lastHash}</p>
        </BlockCard>
      ))}
    </ListContainer>
  );
};

export default BlockchainList;
