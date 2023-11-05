import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Signin from './pages/Signin';
import Signup from './pages/Signup';

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" />} />
      <Route path="/login" Component={Signin} />
      <Route path="/signup" Component={Signup} />
    </Routes>
  );
};

export default App;
