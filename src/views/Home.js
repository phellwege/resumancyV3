import React, {useState} from 'react'
import { Link, useNavigate } from 'react-router-dom';

import { Button, Card, Alert} from 'react-bootstrap';
import { useUser } from '../context/UserContext';
import Header from '../components/header/Header';
import Footer from '../components/footer/Footer';

import './main.css';
import ResumeStyles from '../components/ResumeStyles';

export default function Home() {
    const {
        user,
        subscriptionPlans
    } = useUser();

    const capitalizeAllLetters = (str) => str?.toUpperCase() || "";

    const history = useNavigate();

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
                                {!user?.id && (
                                    <>
                                        <h5>Get Started for Free <br/> Plans from $5/month</h5>
                                        <p className='alignLeft'>
                                        Get started for just $5/month with our Basic plan—includes 1 base resume and 5 custom-tailored resumes and cover letters. Need more? Go Premium for $15/month and enjoy unlimited tailored resumes and cover letters. Try it free for 7 days—cancel anytime, or continue with Basic at $5/month after your trial ends.
                                        </p>
                                    </>
                                )}
                                {user?.subscription.plan === 'basic' && (
                                    <>
                                        <h5>Current Plan: <br/>{capitalizeAllLetters(user.subscription.plan)}</h5>
                                        <div>
                                            <h6>
                                                Usage:<br/>
                                                Base Resume:
                                                ( {user.subscription.usage.baseResume} / {subscriptionPlans[user.subscription.plan].baseResume} )
                                                <br/>
                                                Tailored Resume(s):
                                                ( {user.subscription.usage.tailoredResumes} / {subscriptionPlans[user.subscription.plan].tailoredResumes} )
                                            </h6>
                                                <Button>
                                                    Upgrade Now
                                                </Button>
                                        </div>
                                    </>
                                )}
                                {user?.subscription.plan === 'premium' && (
                                    <>
                                        <h5>
                                            Current Plan: 
                                            <br/>
                                            <span style={{
                                                color:"gold",
                                                fontWeight:"bold"
                                            }}>
                                                {capitalizeAllLetters(user.subscription.plan)}
                                            </span>
                                        </h5>
                                        <Button onClick={() => history('/Account')}>
                                            Manage Account
                                        </Button>
                                    </>
                                )}
                            </div>
                        </Card.Body>
                    </Card>
                    <Card>
                        <Card.Body>
                            <div className='cardInnerDiv'>
                                <h5>How To Use</h5>
                                    <p>Create a Baseline Resume and custom-tailor it for every application. This proven approach significantly increases your chances of landing more interviews.</p>
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
                                            <span className='homeNum'>Step 3. </span> Click on <b>Tailor Resume</b>, then provide prospective job details.
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
                                            Create Resume
                                        </Button>
                                    </Link>
                                ):(
                                    <Link to='/Tailor'>
                                        <Button
                                        aria-label='create button'
                                        >
                                            Tailor Resume
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
