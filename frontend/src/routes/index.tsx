import React from 'react';

import PublicRoutes from 'routes/public';
import PrivateRoutes from 'routes/private';
import { useAuth } from 'hooks/useAuth';

const Routes: React.FC = () => {
  const { signed } = useAuth();

  return signed ? <PrivateRoutes /> : <PublicRoutes />;
};

export default Routes;
