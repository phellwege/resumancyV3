import React from 'react'
import { Link } from 'react-router-dom';
import './footer.css'
export default function Footer() {
  return (
    <>
        <div className='footWrap'>
            <div className='secondaryFootWrap'>
                <div className='footerLeftDiv'>
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
