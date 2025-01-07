import React, {useState, useEffect, useContext} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button, Alert, OverlayTrigger, Tooltip } from 'react-bootstrap';

import LoginAndRegistration from '../LoginAndRegistration';
// import RegisterRecruiter from '../RegisterRecruiter';
import NavBar from '../NavBar/NavBar';

import { useUser } from '../../context/UserContext';
import { useAuth } from '../../context/AuthContext';

import { CgProfile } from "react-icons/cg";
import { FiAlertCircle } from "react-icons/fi";
import { FaHome } from "react-icons/fa";
import logo from '../../static/logo_monochrome.png';

import "./header.css";

function Header(props) {
    const history = useNavigate();
    const [error, setError] = useState('');
    const {
        user, 
        handleOpenLoginModal,
    } = useUser()
    const {
        logout
    } = useAuth()
    const handleClickImg = () => {
        history('/UserProfile')
    }
    const handleNavHome = () => {
        history('/')
    }
    const AlertNotificationMessage = "Notification";
    function AlertMessage(){
        // logic if a user has alerts
        return (
            <>
                <OverlayTrigger
                    overlay={
                    <Tooltip id='tooltip'>
                        {AlertNotificationMessage}
                    </Tooltip>
                }>
                    <span className='AlertMessageIconDiv'>
                        <FiAlertCircle size={25}/>
                    </span>
                    
                </OverlayTrigger>
            </>
        )
    }
    const ifNotfrontPage = () => {
        if(window.location.pathname !== '/' 
        // && window.location.pathname !== '/RecruiterMainPage'
        // && window.location.pathname !== '/RecruiterSetupPage'
        // && window.location.pathname !== '/Recruit'
        // && !window.location.pathname.startsWith('/Recruit/')
        // && !window.location.pathname.startsWith('/RecruitCreateResume/')
        ){
            return (
                <Link to='/' className='backButton'>
                    <FaHome className='backButton'/>
                </Link>
            )
        }
    }
return (
    <>
    <NavBar />
    <LoginAndRegistration />
    {/* <RegisterRecruiter /> */}
    <div className="head_wrap">
        <div className='headerLeft'>
            
        </div>
        <div className="headerMid">
            <div className='logobkg'>
                <img src={logo} alt="Logo" id="LogoSmall2" onClick={handleNavHome}/>
            </div>
            <h1>
                Resumancy
            </h1>
            {error && <Alert variant='danger' className='alerts' dismissible>{error}</Alert>}
        </div>
        <div className='headerRight'>
            {user.id ? (
                <div className='avatarWindow'>
                    {AlertMessage()}
                    <img src={user.avatarImg} alt='userAvatar' id='userAvatar' onClick={handleClickImg}/>
                    {user.userName && (
                        <>
                            <Link to='/UserProfile'>{user.userName}</Link>
                        </>
                    )}
                    <Link to='' onClick={() => {
                        logout();
                        history('/');
                    }}>Logout</Link>
                </div>
            ) : (
                <div className='avatarWindow'>
                    <Link to='' onClick={handleOpenLoginModal}>
                        <CgProfile size={45} />
                    </Link>
                    <Link to='' onClick={handleOpenLoginModal}>Login / Register</Link>
                </div>
            )}
        </div>
    </div>
    {ifNotfrontPage()}
    </>
);
}

export default Header;