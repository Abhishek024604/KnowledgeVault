import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function PrivateRoute({ children }) {
  const { currentUser } = useAuth();

  const location = useLocation();

  if (!currentUser) {
    return <Navigate to={`/login${location.search}`} />;
  }

  return children;
}
