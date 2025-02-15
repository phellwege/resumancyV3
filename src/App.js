
import React, {useState} from 'react';
import { Route, Routes, BrowserRouter } from 'react-router-dom';

import PrivateRoute from '../src/components/privateRoute';
import {ThemeProvider} from 'styled-components';
import { UserProvider } from './context/UserContext';
import { AuthProvider } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import Home from '../src/views/Home'

import FAQ from './views/legal/FAQ';
import TermsOfUse from './views/legal/TermsOfUse';
import PrivacyPolicy from './views/legal/PrivacyPolicy';
import Create from './views/Create';
import Tailor from './views/Tailor';
import Review from './views/Review';
import InitialUserSetup from './views/InitialUserSetup';
import UserProfile from './views/UserProfile';
import Subscribe from './views/Subscribe';
import Account from './views/Account';
import OverLimit from './views/OverLimit';
import SuccessPage from './views/SuccessPage';

function App() {
  const [theme, setTheme] = useState({mode: 'light'})

  return (
    <BrowserRouter>
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
            <Route exact path='/Subscribe' element={<Subscribe />} />
            <Route exact path='/Account' element={<PrivateRoute><Account /></PrivateRoute>} />
            <Route exact path='/OverLimit' element={<PrivateRoute><OverLimit /></PrivateRoute>} />
            <Route exact path='/Success' element={<SuccessPage />} />

            </Routes>
          </React.Fragment>
        </DataProvider>
        </AuthProvider>
        </UserProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
