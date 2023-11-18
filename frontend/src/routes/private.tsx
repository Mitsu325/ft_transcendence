import React from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Home from 'pages/Home';
import { Game } from 'components/Game';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/socket.io',
    element: <Game />,
  },
]);

const PrivateRoutes: React.FC = () => {
  return <RouterProvider router={router} />;
};

export default PrivateRoutes;
