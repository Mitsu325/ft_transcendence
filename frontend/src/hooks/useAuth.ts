import { useContext } from 'react';
import AuthContext from 'contexts/auth';

export function useAuth() {
  const context = useContext(AuthContext);
  return context;
}
