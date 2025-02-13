import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';

export default function PrivateRoute({ children }) {
    const { user, setError } = useUser();
    const [redirectPath, setRedirectPath] = React.useState(null);

    useEffect(() => {
        if (user?.id && !user?.initialSetupDone) {
            setError("Please complete your initial setup before proceeding.");
            setRedirectPath("/InitialUserSetup");
        } else if (user?.initialSetupDone && !user?.subscription.plan) {
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
