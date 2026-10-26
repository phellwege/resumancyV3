import { Navigate, useLocation } from 'react-router-dom';
import { useUser } from '../context/UserContext';

// No accounts: a "profile" is local to this browser. Pages other than Home
// need one, and the profile details must be filled in before creating resumes.
export default function PrivateRoute({ children }) {
  const { user } = useUser();
  const location = useLocation();

  if (location.pathname === '/') return children;
  if (!user?.id) return <Navigate to="/" replace />;
  if (!user.initialSetupDone) return <Navigate to="/InitialUserSetup" replace />;
  return children;
}
