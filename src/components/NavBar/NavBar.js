import React, { useEffect, useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {Button} from 'react-bootstrap';
import { ThemeProvider } from 'styled-components';
import Toggle from '../Toggle/DayNight_Mode';
import { MdClose } from "react-icons/md";
import { FiMenu } from "react-icons/fi";
import GlobalStyle from '../globalStyle';

import { FaHome } from "react-icons/fa";
import { MdOutlinePostAdd } from "react-icons/md";
import { MdOutlineNoteAdd } from "react-icons/md";
import { MdPreview } from "react-icons/md";

import { CgProfile } from "react-icons/cg";

import "./NavBar.css";
import { useUser } from '../../context/UserContext';


const NavBar = () => {
    const history = useNavigate();
    const [toggled, setToggled] = useState(false);
    const [theme, setTheme] = useState({mode: 'dark'})
    const {
        user
    } = useUser()
    const handleClick =() => {
        setToggled((s)=>!s);
        setTheme(theme.mode === 'dark' ? {mode: 'light'}: {mode:'dark'})
    }
    const [navbarOpen, setNavbarOpen] = useState(false)
    const handleToggle = () => {
        setNavbarOpen(prev => !prev)
    }
    const closeMenu = () => {
        setNavbarOpen(false)
    }
    useEffect(() => {
        const data = window.localStorage.getItem('UnleashedCVWizardThemeKey')
        if(data != null) setTheme(JSON.parse(data))
    }, [])

    useEffect(() => {
        window.localStorage.setItem('UnleashedCVWizardThemeKey', JSON.stringify(theme)) 
    }, [theme])
    let menuRef = useRef();

    useEffect(() => {
        let handler = (event) => {
            if(user.initialSetupDone && !menuRef.current.contains(event.target)){
                setNavbarOpen(false);
            }
        }
        document.addEventListener('mousedown', handler)
        return () => {
            document.removeEventListener('mousedown', handler);
        }
    })

// the first set is dark mode the second is light mode
// dark contrast color b1b1b3
// light contrast color #111
    return (
        <>
        <ThemeProvider theme={theme}>
        <GlobalStyle />
        {/* {user.initialSetupDone && ( */}
            <div id="Hamburger_Menu">
                <nav ref={menuRef} className="navBar">
                    <button 
                    id='openCloseButton'
                    aria-label='hamburger menu button'
                    onClick={handleToggle}>
                        {navbarOpen ? (
                        <MdClose style={{ color: "#E4FDE1", width: "40px", height: "40px" }} />
                        ) : (
                        <FiMenu style={{ color: "#E4FDE1", width: "40px", height: "40px" }} />
                        )}
                    </button>
                        <ul className={`menuNav ${navbarOpen ? " showMenu" : ""}`}>
                            <li>
                                <Link to='/' onClick={() => closeMenu()}>
                                    <FaHome className='navIcons'/> 
                                    Home
                                </Link>
                            </li>
                            {user && (
                                <>
                                {user.subscription.usage.baseResume === 0 && (
                                    <li>
                                        <Link to='/Create' onClick={() => closeMenu()}>
                                            <MdOutlinePostAdd className='navIcons'/> 
                                            Create Resume
                                        </Link>
                                    </li>
                                )}
                                    <li>
                                        <Link to='/Tailor' onClick={() => closeMenu()}>
                                            <MdOutlineNoteAdd className='navIcons'/> 
                                            Custom Tailor
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to='/Review' onClick={() => closeMenu()}>
                                            <MdPreview className='navIcons'/> 
                                            Review
                                        </Link>
                                    </li>
                                </>
                            )}
                            {user.id && (
                                <li>
                                    <Link to="/UserProfile" onClick={() => closeMenu()}>
                                        <CgProfile className='navIcons'/> 
                                        Profile
                                    </Link>
                                </li>
                            )}
                            {/* {user.recruiter === true && (
                                <li>
                                    <Link to='/RecruiterMainPage' onClick={() => closeMenu()}>
                                        Recruiter Home
                                    </Link>
                                </li>
                            )} */}
                            <li>
                                <div className="Mode" id='menu_toggle' onClick={() => closeMenu()}>
                                    <Toggle toggled={toggled} onClick={handleClick} />
                                    {theme.mode === 'dark' ? "Dark" : "Light"}
                                </div>
                            </li>
                        </ul>
                </nav>
            </div>
        {/* )} */}
            </ThemeProvider>
        </>
    )
}
export default NavBar;