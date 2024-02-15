import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from 'pages/Home/home';
import CommonLayout from 'components/Layout';
import Chat from 'pages/Chat';
import { Game } from 'pages/Game';
import Register from 'pages/Register';
import HistoricTable from 'pages/HistoricTable';
import Friend from 'pages/Friend';
import Manager from 'pages/Management';
import { UserStatusUpdater } from '../utils/user-status';

const PrivateRoutes: React.FC = () => {
  UserStatusUpdater();
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<CommonLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/game-options" element={<Game />} />
          <Route path="/message" element={<Chat />} />
          <Route
            path="/profile/:username"
            element={<Register content="profile-data" />}
          />
          <Route
            path="/profile/:username/edit"
            element={<Register content="profile-edit" />}
          />
          <Route
            path="/profile/:username/security"
            element={<Register content="security" />}
          />
          <Route
            path="/profile/:username/blocked-users"
            element={<Register content="blocked-users" />}
          />
          <Route path="/historic" element={<HistoricTable />} />
          <Route path="/friend" element={<Friend content="friend" />} />
          <Route path="/friend/invite" element={<Friend content="invite" />} />
          <Route
            path="/friend/invite/received"
            element={<Friend content="invite-received" />}
          />
          <Route
            path="/friend/invite/sent"
            element={<Friend content="invite-sent" />}
          />
          <Route path="/manager" element={<Manager />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default PrivateRoutes;
