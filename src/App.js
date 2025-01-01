
import React, {useState} from 'react';
import { Route, Routes, BrowserRouter } from 'react-router-dom';

import PrivateRoute from '../src/components/privateRoute';
import {ThemeProvider} from 'styled-components';
import { UserProvider } from './context/UserContext';
import { AuthProvider } from './context/AuthContext';
import Home from '../src/views/Home'
// import RecruiterSetupPage from './views/RecruiterSetupPage';

import FAQ from './views/legal/FAQ';
import TermsOfUse from './views/legal/TermsOfUse';
import PrivacyPolicy from './views/legal/PrivacyPolicy';
import Create from './views/Create';
import Tailor from './views/Tailor';
import Review from './views/Review';
import UserProfile from './views/UserProfile';
// import RecruiterMainPage from './views/RecruiterMainPage';
// import Recruit from './views/Recruit';
// import RecruitCreateResume from './views/RecruitCreateResume';

function App() {
  const [theme, setTheme] = useState({mode: 'light'})

  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <UserProvider >
        <AuthProvider>
          <React.Fragment>
            <Routes>
            <Route exact path="/" element={<Home />} />
            {/* <Route exact path="/RecruiterSetupPage" element={<RecruiterSetupPage />} /> */}
            <Route exact path="/FAQ" element={<FAQ />} />
            <Route exact path="/TermsOfUse" element={<TermsOfUse />} />
            <Route exact path='/PrivacyPolicy' element={<PrivacyPolicy/>} />
            <Route exact path='/Create' element={<Create />} />
            <Route exact path='/Tailor' element={<Tailor />} />
            <Route exact path='/Review' element={<Review />} />
            <Route exact path='/UserProfile' element={<UserProfile />} />
            {/* <Route exact path='/RecruiterMainPage' element={<RecruiterMainPage />} /> */}
            {/* <Route exact path='/Recruit' element={ <Recruit/> } />
            <Route exact path='/Recruit/:recruitId' element={ <Recruit/> } />
            <Route exact path='/RecruitCreateResume/:recruitId' element={<RecruitCreateResume />} /> */}
            </Routes>
          </React.Fragment>
        </AuthProvider>
        </UserProvider>
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
