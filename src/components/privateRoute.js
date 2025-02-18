import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';

export default function PrivateRoute({ children }) {
  const { user, setError } = useUser();
  const [redirectPath, setRedirectPath] = useState(null);

  useEffect(() => {
    // Optionally wait for a "loaded" flag if available in your user state.
    if (!user?.id) return; // user not loaded yet

    if (user?.id && !user?.initialSetupDone) {
      setError("Please complete your initial setup before proceeding.");
      setRedirectPath("/InitialUserSetup");
    } else if (user?.id && user?.initialSetupDone && !user?.subscription.active) {
      setError("Your subscription is inactive. Please choose a plan to continue.");
      setRedirectPath("/Subscribe");
    } else {
      setRedirectPath(null);
    }
  }, [user, setError]);

  if (redirectPath) {
    return <Navigate to={redirectPath} />;
  }

  return children;
}
