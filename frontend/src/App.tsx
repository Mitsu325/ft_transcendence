import React from 'react';
import { Routes, Route } from 'react-router-dom';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Home from './pages/Home';

const App = () => {
  return (
    <Routes>
      {/* <Route path="/" element={<Navigate to="/login" />} /> */}
      <Route path="/login" Component={SignIn} />
      <Route path="/signup" Component={SignUp} />
      <Route path="/" Component={Home} />
    </Routes>
  );
};

export default App;
