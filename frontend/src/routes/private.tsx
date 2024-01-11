import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from 'pages/Home/home';
import GameOptions from 'pages/GameOptions';
import CommonLayout from 'components/Layout';
import Chat from 'pages/Chat';
import Register from 'pages/Register';

const PrivateRoutes: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<CommonLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/game-options" element={<GameOptions />} />
          <Route path="/message" element={<Chat />} />
          <Route path="/profile" element={<Register />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default PrivateRoutes;
