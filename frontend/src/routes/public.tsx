import React from 'react';
import { RouterProvider, createBrowserRouter } from 'react-router-dom';
import SignIn from 'pages/SignIn';
import SignUp from 'pages/SignUp';
import TwoFactorModal from 'components/TwoFactModal';

const router = createBrowserRouter([
  {
    path: '/',
    element: <SignIn />,
  },
  {
    path: '/sign-up',
    element: <SignUp />,
  },
]);

const PublicRoutes: React.FC = () => {
  return <RouterProvider router={router} />;
};

export default PublicRoutes;
