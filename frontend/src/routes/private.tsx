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
          <Route
            path="/profile"
            element={<Register content="profile-data" />}
          />
          <Route
            path="/profile/edit"
            element={<Register content="profile-edit" />}
          />
          <Route
            path="/profile/security"
            element={<Register content="security" />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default PrivateRoutes;
