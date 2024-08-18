import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import AuthPage from './pages/AuthPage';
import HomePage from './pages/HomePage';
import SendTransactionPage from './pages/SendTransactionPage';
import TransactionHistoryPage from './pages/TransactionHistoryPage';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/home" element={<HomePage />} />
        <Route path="/send-transaction" element={<SendTransactionPage />} />
        <Route path="/transaction-history" element={<TransactionHistoryPage />} />
        <Route path="/" element={<Navigate to="/auth" />} /> {/* Om någon går till "/" omdirigeras de till "/auth" */}
      </Routes>
    </Router>
  );
};

export default App;
