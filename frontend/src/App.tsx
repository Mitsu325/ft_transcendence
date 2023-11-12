import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import TwoFactorAuthPage from 'pages/TwoFact';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" Component={SignIn} />
      <Route path="/signup" Component={SignUp} />
      <Route path="/two-factor-auth" Component={TwoFactorAuthPage} />
    </Routes>
  );
};

export default App;
