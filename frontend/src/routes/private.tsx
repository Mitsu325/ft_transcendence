import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from 'pages/Home/home';
import CommonLayout from 'components/Layout';
import Chat from 'pages/Chat';
import { Game } from 'components/Game';
// import { Historic } from 'components/Historic';
import Register from 'pages/Register';
import HistoricTable from 'components/HistoricTable';

const PrivateRoutes: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<CommonLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/game-options" element={<Game />} />
          <Route path="/message" element={<Chat />} />
          <Route path="/profile" element={<Register />} />
          <Route path="/historic" element={<HistoricTable />} />s
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default PrivateRoutes;
