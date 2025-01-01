import React from 'react'
import Linkedin from '../../static/socialIcons/linkedin-3-32.png'
import { Link } from 'react-router-dom';
import './footer.css'
export default function Footer() {
  return (
    <>
        <div className='footWrap'>
            <div className='secondaryFootWrap'>
                <div className='footerLeftDiv'>
                <div className='socialIcons'>
                    <a href='https://www.linkedin.com/company/resumancy/' target='_blank' alt='link to linkedin'>
                    <img src={Linkedin} className='socialImg' alt='linkedin image'/>
                    </a>
                    {/* <a href='' target='_blank' alt='link to facebook'>
                    <img src={FaceBook} className='socialImg' alt='facebook image'/>
                    </a> */}
                </div>
                <Link to=''>
                    CONTACT US
                </Link>
                </div>
                <div className='footerRightDiv'>
                <ul>
                    <li>
                        <Link to='/FAQ'>
                            FAQ
                        </Link>
                    </li>
                    <li>
                        <Link to='/TermsOfUse'>
                            Terms of Service
                        </Link>
                    </li>
                    <li>
                        <Link to='/PrivacyPolicy'>
                            Privacy Policy
                        </Link>
                    </li>
                </ul>
                </div>
            </div>
            <span className='subscript'>
            © {(new Date().getFullYear())} Resumancy. All rights reserved.
            </span>
        </div>
    </>
  )
}
