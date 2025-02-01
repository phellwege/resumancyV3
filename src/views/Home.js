import React, {useState} from 'react'
import { Link } from 'react-router-dom';
import { Button, Card, Alert} from 'react-bootstrap';
import { useUser } from '../context/UserContext';
import Header from '../components/header/Header';
import Footer from '../components/footer/Footer';

import './main.css';
import ResumeStyles from '../components/ResumeStyles';

export default function Home() {
    const {
        user
    } = useUser();
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
                                    <h5>What We Do</h5>
                                    <p className='leftShiftedText'>
                                    We use AI to transform your job search. 
                                    <br/> 
                                    Create a base resume quickly, then easily tailor it for specific jobs by simply entering the company name and job description. Our AI even generates a personalized cover letter for you!
                                    <br/>
                                    Say goodbye to generic applications and stand out with resumes and cover letters tailored to each job. Let Resumancy be your secret weapon for landing your dream job. 
                                    </p>
                                    <p>
                                        <Link className='faqSpan' to='/FAQ'>
                                        Have questions? Visit our FAQ to learn more
                                        </Link>
                                    </p>
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                    <Card>
                        <Card.Body>
                            <div className='cardInnerDiv'>
                                <h5>Get Started</h5>
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
                                {user.subscription.usage.baseResume === 0 ? (
                                    <Link to='/Create'>
                                        <Button
                                        aria-label='create button'
                                        >
                                            Create
                                        </Button>
                                    </Link>
                                ):(
                                    <Link to='/Tailor'>
                                        <Button
                                        aria-label='create button'
                                        >
                                            Custom Tailor
                                        </Button>
                                    </Link>
                                )}
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
