import React, {useEffect} from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Alert, OverlayTrigger, Tooltip } from 'react-bootstrap';

import LoginAndRegistration from '../LoginAndRegistration';
import NavBar from '../NavBar/NavBar';

import { useUser } from '../../context/UserContext';
import { useAuth } from '../../context/AuthContext';

import { CgProfile } from "react-icons/cg";
import { FiAlertCircle } from "react-icons/fi";
import { FaHome } from "react-icons/fa";
import logo from '../../static/logo_monochrome.webp';

import "./header.css";

function Header(props) {
    const history = useNavigate();
    const {
        user, 
        handleOpenLoginModal,
        successMessage,
        setSuccessMessage,
        error,
        setError,
    } = useUser()
    const {
        logout
    } = useAuth();
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
        ){
            return (
                <Link to='/' className='backButton'>
                    <FaHome className='backButton'/>
                </Link>
            )
        }
    };

    useEffect(() => {
        const timeouts = [];
        if (successMessage) {
            const timeout = setTimeout(() => setSuccessMessage(''), 3000);
            timeouts.push(timeout);
        }
        if (error) {
            const timeout = setTimeout(() => setError(''), 4500);
            timeouts.push(timeout);
        }
        return () => {
            timeouts.forEach(t => clearTimeout(t));
        };
    }, [successMessage, error]);
    
return (
    <>
    <NavBar />
    <LoginAndRegistration />
    <div className="head_wrap">
        <div className='headerLeft'>

        {/* Error Message Alert */}
        {error && (
            <Alert variant="danger" className="alerts mt-4" dismissible>
            <Alert.Heading>Error</Alert.Heading>
            {error}
            </Alert>
        )}

        {/* Success Message Alert */}
        {successMessage && (
            <Alert variant="light" className="alerts mt-4" dismissible>
                {/* <Alert.Heading>Success</Alert.Heading> */}
                    {successMessage}
            </Alert>
        )}

        </div>
        <div className="headerMid">
            <div className='logobkg'>
                <img src={logo} alt="Logo" id="LogoSmall2" onClick={handleNavHome}/>
            </div>
            <h1>
                Resumancy
            </h1>
        </div>
        <div className='headerRight'>
            {user.id ? (
                <div className='avatarWindow'>
                    {/* {AlertMessage()} */}
                    {user.avatarImg ? (
                        <img src={user.avatarImg} alt='userAvatar' id='userAvatar' onClick={handleClickImg}/>
                    ) : (
                        <CgProfile size={65} onClick={handleClickImg} aria-hidden="true" />
                    )}
                    {user.userName && (
                        <>
                            <Link to='/UserProfile' aria-label={`View ${user.userName}'s profile`}>{user.userName}</Link>
                        </>
                    )}
                    <Link to='' onClick={async () => {
                        await logout();
                        history('/');
                    }} aria-label="Log out of your account">
                        Logout
                    </Link>
                </div>
            ) : (
                <>
                {user.initialSetupDone || window.location.pathname == '/' &&(
                    <div className='avatarWindow'>
                        <div className='modalAvatarImg'>
                            <>
                            <Link to='' onClick={handleOpenLoginModal} aria-label="Open login modal">
                                <CgProfile size={65} aria-hidden="true" />
                                <span className="sr-only">Profile Login</span>
                            </Link>
                            <Link to='' onClick={handleOpenLoginModal} aria-label="Login or register for an account">Login / Register</Link>
                            </>
                        </div>
                    </div>
                )}
                </>
            )}
        </div>
    </div>
    {user.initialSetupDone && (
        <>
        {ifNotfrontPage()}
        </>
    )}
    </>
);
}

export default Header;