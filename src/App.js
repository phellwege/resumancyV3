import React, {useState} from 'react';
import { Route, Routes, HashRouter, Navigate } from 'react-router-dom';

import PrivateRoute from './components/privateRoute';
import {ThemeProvider} from 'styled-components';
import { UserProvider } from './context/UserContext';
import { AuthProvider } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import Home from './views/Home'

import FAQ from './views/legal/FAQ';
import TermsOfUse from './views/legal/TermsOfUse';
import PrivacyPolicy from './views/legal/PrivacyPolicy';
import Create from './views/Create';
import Tailor from './views/Tailor';
import Review from './views/Review';
import InitialUserSetup from './views/InitialUserSetup';
import UserProfile from './views/UserProfile';
import Account from './views/Account';

function App() {
  const [theme] = useState({mode: 'light'})

  return (
    // HashRouter: GitHub Pages serves static files only, so deep links use #/route.
    <HashRouter>
      <ThemeProvider theme={theme}>
        <UserProvider >
        <AuthProvider>
        <DataProvider>
          <React.Fragment>
            <Routes>
            <Route exact path="/" element={<PrivateRoute><Home /></PrivateRoute>} />
            <Route exact path="/FAQ" element={<FAQ />} />
            <Route exact path="/TermsOfUse" element={<TermsOfUse />} />
            <Route exact path='/PrivacyPolicy' element={<PrivacyPolicy/>} />
            
            <Route exact path='/Create' element={<PrivateRoute><Create /></PrivateRoute>} />
            <Route exact path='/Tailor' element={<PrivateRoute><Tailor /></PrivateRoute>} />
            <Route exact path='/Review' element={<PrivateRoute><Review /></PrivateRoute>} />
            <Route exact path='/UserProfile' element={<PrivateRoute><UserProfile /></PrivateRoute>} />
            <Route exact path='/InitialUserSetup' element={<InitialUserSetup />} />
            <Route exact path='/Account' element={<PrivateRoute><Account /></PrivateRoute>} />
            <Route path='*' element={<Navigate to='/' replace />} />

            </Routes>
          </React.Fragment>
        </DataProvider>
        </AuthProvider>
        </UserProvider>
      </ThemeProvider>
    </HashRouter>
  );
}

export default App;
