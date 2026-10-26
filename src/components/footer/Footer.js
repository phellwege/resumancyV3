import React from 'react'
import Linkedin from '../../static/socialIcons/linkedin-3-32.webp'
import { Link } from 'react-router-dom';
import './footer.css'
export default function Footer() {
  return (
    <>
        <div className='footWrap'>
            <div className='secondaryFootWrap'>
                <div className='footerLeftDiv'>
                <div className='socialIcons'>
                    <a href='https://www.linkedin.com/company/resumancy/' target='_blank' rel='noopener noreferrer' aria-label='Resumancy on LinkedIn'>
                    <img src={Linkedin} className='socialImg' alt='linkedin image'/>
                    </a>
                    {/* <a href='' target='_blank' alt='link to facebook'>
                    <img src={FaceBook} className='socialImg' alt='facebook image'/>
                    </a> */}
                </div>
                <a href='https://github.com/phellwege/resumancyV3' target='_blank' rel='noopener noreferrer'>
                    SOURCE ON GITHUB
                </a>
                </div>
                <div className='footerRightDiv'>
                <ul>
                    <li>
                        <Link to='/FAQ' aria-label="View Frequently Asked Questions about resume creation and customization">
                            Frequently Asked Questions
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
            {(new Date().getFullYear())} Resumancy. Portfolio demo, runs entirely in your browser.
            </span>
        </div>
    </>
  )
}
