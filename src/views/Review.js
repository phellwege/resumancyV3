import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import Header from '../components/header/Header';
import Footer from '../components/footer/Footer';
import BaseResumeTable from '../components/Review/BaseResumeTable';
import TailoredResumeTable from '../components/Review/TailoredResumeTable';
import { Button, Alert } from "react-bootstrap";
import { MdScreenRotation } from "react-icons/md";

import '../views/main.css';

export default function Review() {
    const history = useNavigate();
    const [isPortrait, setIsPortrait] = useState(false);

    // Check if the device is in portrait mode
    useEffect(() => {
        const checkOrientation = () => {
            setIsPortrait(window.innerHeight > window.innerWidth);
        };

        // Check on initial load
        checkOrientation();

        // Add event listener for orientation changes
        window.addEventListener('resize', checkOrientation);

        // Clean up
        return () => {
            window.removeEventListener('resize', checkOrientation);
        };
    }, []);

  return (
    <>
    <Header />
    <div className='pageWrapper'>
      {isPortrait && (
        <Alert className="orientation-alert" variant="info">
          <div className="orientation-alert-content">
            <MdScreenRotation size={24} />
            <div>For a better viewing experience, please rotate your device to landscape mode.</div>
          </div>
        </Alert>
      )}
      <h1>Review</h1>
      <div>
        <BaseResumeTable />
        <div className='centeredReviewButtonDiv'>
          <h6>Create a Tailored Resume</h6>
          <p>Customizing your resume for a specific job has been shown to increase your chances of landing an interview.</p>
          <Button onClick={() => history('/Tailor')}>
            Tailor Resume
          </Button>
        </div>
        <TailoredResumeTable />
      </div>
    </div>
    <Footer />
    </>
  )
}
