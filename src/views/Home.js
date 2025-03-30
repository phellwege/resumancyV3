import React, { memo, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet'; 

import { Button, Card} from 'react-bootstrap';
import { useUser } from '../context/UserContext';
import Header from '../components/header/Header';
import Footer from '../components/footer/Footer';
import CurrentPlans from '../components/user/CurrentPlans';

import './main.css';
import ResumeStyles from '../components/ResumeStyles';
import ReviewCarousel from '../components/ReviewCarousel';
// Memoize the text content component to prevent unnecessary re-renders
const WhatWeDoText = memo(() => (
  <p className='leftShiftedText'>
    We use AI to transform your job search. 
    <br/> 
    Create a base resume quickly, then easily tailor it for specific jobs by simply entering the company name and job description. Our AI even generates a personalized cover letter for you!
    <br/>
    Say goodbye to generic applications and stand out with resumes and cover letters tailored to each job. Let Resumancy be your secret weapon for landing your dream job. 
  </p>
));

export default function Home() {
    const {
        user,
        handleOpenLoginModal,
        setError
    } = useUser();

    const history = useNavigate();

    // Preload critical content
    useEffect(() => {
        // Add preload hint for the main content
        const preloadLink = document.createElement('link');
        preloadLink.rel = 'preload';
        preloadLink.as = 'fetch';
        preloadLink.href = window.location.href;
        document.head.appendChild(preloadLink);
        
        return () => {
            if (document.head.contains(preloadLink)) {
                document.head.removeChild(preloadLink);
            }
        };
    }, []);

    const handleCreateClick = () => {
        if (!user?.id) {
            setError("You must be signed in to create a resume");
            handleOpenLoginModal();
        } else {
            history('/Create');
        }
    };
    let email = window.localStorage.getItem('emailForSignIn');

  return (
    <>
    <Helmet>
      <title>Resumancy - AI-Powered Resume Builder | Create Custom Resumes in 45 Seconds</title>
      <meta name="description" content="Create tailored resumes and cover letters for every job application in under a minute with our AI-powered platform. Get more interviews with custom resumes." />
      <link rel="canonical" href="https://resumancy.com" />
    </Helmet>
    <Header />
        <main className='pageWrapper'>
            {!user?.id && (
            <section className='heroSection' aria-label="Main introduction to Resumancy">
                <div className='heroContent'>
                    <h1>Tailor Your Resume to Any Job in Seconds — Not Just Format It</h1>
                    <p className="heroSubtitle">Resumancy reads your resume and the job description, then rewrites your content to match
                        <br/>with job relevance scoring, skill gap insights, and interview-boosting recommendations.</p>
                    <div className='heroStats'>
                        <div className='statItem'>
                            <span className='statNumber'>45 sec</span>
                            <span className='statLabel'>Average Creation Time</span>
                        </div>
                    </div>
                    <div className='heroFeatures'>
                        <div className='featureItem'>
                            AI-Powered Resume Customization
                        </div>
                        <div className='featureItem'>
                            See Your Resume's Job Relevance Score
                        </div>
                        <div className='featureItem'>
                            Skill Gap Analysis to Boost Your Application
                        </div>
                    </div>
                    <div className='heroCTA'>
                        <Button 
                            variant="primary"
                            onClick={handleOpenLoginModal}
                            className='heroButton'
                        >
                            Start Your 7-Day Free Trial
                        </Button>
                        <Button 
                            variant="outline-light"
                            as={Link} 
                            to="/FAQ"
                            className='heroButton'
                            aria-label="View Frequently Asked Questions about Resumancy"
                        >
                            View FAQ
                        </Button>
                    </div>
                </div>
            </section>
            )}
            <div className='secondaryPageWrapper'>
                <section className='leftDiv'>
                    <Card className='homeLeftCard'>
                        <Card.Body>
                            <div className='cardInnerDiv'>
                                <h2>Reviews</h2>
                                <ReviewCarousel />
                            </div>
                        </Card.Body>
                    </Card>
                    <Card className='homeLeftCard'>
                        <Card.Body>
                            <div className='cardInnerDiv'>
                                <h2>Sample Resumes</h2>
                                <div className='homeLeftCardImageDiv'>
                                    <ResumeStyles />
                                </div>
                            </div>
                        </Card.Body>
                    </Card>
                </section>
                <section className='rightDiv'>
                    <article>
                        <Card>
                            <Card.Body>
                                <div className='cardInnerDiv'>
                                    <div>
                                        <h2>What We Do</h2>
                                        <WhatWeDoText />
                                        <p>
                                            <Link className='faqSpan' to='/FAQ' aria-label="View comprehensive FAQ about resume creation and customization">
                                            Frequently Asked Questions
                                            </Link>
                                        </p>
                                    </div>
                                </div>
                            </Card.Body>
                        </Card>
                    </article>
                    <CurrentPlans/>
                    <article>
                        <Card>
                            <Card.Body>
                                <div className='cardInnerDiv'>
                                    <h2>How To Use</h2>
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
                                            <Button
                                            onClick={handleCreateClick}
                                            aria-label='create button'
                                            >
                                                Create Resume
                                            </Button>
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
                    </article>
                </section>
            </div>
        </main>
    <Footer />
    </>
  )
}
