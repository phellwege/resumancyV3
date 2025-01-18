import React from 'react'
import { Routes, Route, Navigate} from 'react-router-dom'
import { useUser } from '../context/UserContext'

export default function InitialSetupCheck({children}) {
  const {
    user
  } = useUser()
  if (!user?.initialSetupDone) {
    return <Navigate to="/InitialUserSetup" replace />;
  }

  return <>{children}</>;
}
