import React from 'react';
import './NightNDay.css'
import {BsFillBrightnessHighFill, BsFillMoonStarsFill} from "react-icons/bs";


const DayNight_Mode = ({ toggled, onClick }) => {
    return (
        <>
            <div onClick={onClick} className={`toggle${toggled ? ' night' : ""}`}>
                <BsFillMoonStarsFill size={30} id='nightMoon'/>
                <BsFillBrightnessHighFill size={30} id='daySun'/>
            </div>
        </>
    )
}
export default DayNight_Mode;