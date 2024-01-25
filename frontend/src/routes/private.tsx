import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from 'pages/Home/home';
import CommonLayout from 'components/Layout';
import Chat from 'pages/Chat';
import { Game } from 'components/Game';
import Register from 'pages/Register';
import HistoricTable from 'components/HistoricTable';
import Statistics from 'components/Statistics';
import Friend from 'pages/Friend';

const PrivateRoutes: React.FC = () => {
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
          <Route path="/historic" element={<HistoricTable />} />
          <Route path="/statistics" element={<Statistics />} />
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
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default PrivateRoutes;
