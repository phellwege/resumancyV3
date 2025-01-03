import React, {useState} from 'react'
import { Link } from 'react-router-dom';
import { Button, Card, Alert} from 'react-bootstrap';

import Header from '../components/header/Header';
import Footer from '../components/footer/Footer';

import './main.css';
import ResumeStyles from '../components/ResumeStyles';

export default function Home() {
    
  return (
    <>
    <Header />
    <div className='pageWrapper'>
            <div className='secondaryPageWrapper'>
                <div className='leftDiv'>
                    <Card className='homeLeftCard'>
                        <Card.Body>
                            <div className='cardInnerDiv'>
                                <h4>Sample Resumes</h4>
                                <div className='homeLeftCardImageDiv'>
                                    <ResumeStyles />
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </div>
                <div className='rightDiv'>
                    <Card>
                        <Card.Body>
                            <div className='cardInnerDiv'>
                                <div>
                                    <h4>What We Do</h4>
                                    <p className='leftShiftedText'>
                                    We use AI to transform your job search. 
                                    <br/> 
                                    Start with creating a Base Resume, then tailor it for specific jobs by providing the company name and description. No more generic applications – stand out with personalized resumes showcasing your strengths. Elevate your job search with Resumancy and let AI be your secret weapon for landing your dream job. <br/> To learn more visit our 
                                        <Link className='faqSpan' to='/FAQ'>
                                            FAQ
                                        </Link>
                                    </p>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                    <Card>
                        <Card.Body>
                            <div className='cardInnerDiv'>
                                <h4>Get Started</h4>
                                    <p>Create a Baseline Resume and custom tailor it to each application.</p>
                                <div className='alignLeft'>
                                    <div>
                                        <p>
                                            <span className='HomeSectionTitle'>Part 1</span>
                                            <br/>
                                            <span className='HomeSectionSubScript'>Create a Base Resume.</span>
                                            <br/>
                                            <span className='homeNum'>Step 1. </span> Create a Base Resume by clicking <b>Create Resume</b>. 
                                            <br/>
                                            <span className='homeNum'>Step 2. </span> Verify everything looks good (make edits if needed).
                                        </p>
                                    </div>
                                    <div>
                                        <p>
                                            <span className='HomeSectionTitle'>Part 2</span>
                                            <br/>
                                            <span className='HomeSectionSubScript'>Create Custom Resumes for each application.</span>
                                            <br/>
                                            <span className='homeNum'>Step 3. </span> Click on <b>Custom Tailor</b>, then provide prospective job details.
                                            <br/>
                                            <span className='homeNum'> Step 4. </span> Enjoy your custom tailored resume(s).
                                        </p>
                                    </div>
                                    
                                </div>
                                <Link to='/Create'>
                                    <Button
                                    aria-label='create button'
                                    >
                                        Create
                                    </Button>
                                </Link>
                            </div>
                        </Card.Body>
                    </Card>
                    {/* <Card>
                        <Card.Body>
                            <div className='cardInnerDiv'>
                                <div className='homeCardInnerDiv'>
                                    <h4>Current Tier: {defaultSubscription.name}</h4>
                                    {currentSubscriptionSection()}
                                </div>
                                <br/>
                                <div className='homeCardInnerDiv'>
                                    {showSection()}
                                    {showButton()}
                                </div>
                            </div>
                        </Card.Body>
                    </Card> */}
                </div>
            </div>
        </div>
    <Footer />
    </>
  )
}
