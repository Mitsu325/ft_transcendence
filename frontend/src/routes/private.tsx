import React from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import Home from 'pages/Home';

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
]);

const PrivateRoutes: React.FC = () => {
  return <RouterProvider router={router} />;
};

export default PrivateRoutes;
