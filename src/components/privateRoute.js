import React from 'react'
import { Routes, Route, Navigate} from 'react-router-dom'
import { useUser } from '../context/UserContext';

export default function PrivateRoute({children}) {
    const {
        user
    } = useUser();
    // const {currentUser} = useAuth();

    // return currentUser ? children : <Navigate to='/Home'/>
    if (!user?.initialSetupDone) {
        return <Navigate to="/InitialUserSetup" replace />;
    }

    // check to see if subscription is expired or no longer active - if they attempt to access resume creation, reroute to /Subscribe
    // if (user?.)
}