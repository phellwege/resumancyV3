import React from 'react';
import { useNavigate } from 'react-router-dom';

import Header from '../components/header/Header';
import Footer from '../components/footer/Footer';
import BaseResumeTable from '../components/Review/BaseResumeTable';
import TailoredResumeTable from '../components/Review/TailoredResumeTable';
import { Button, Card, OverlayTrigger, Tooltip} from "react-bootstrap";
import { BsQuestionCircle } from "react-icons/bs";

import '../views/main.css';
import { useUser } from '../context/UserContext';
import { useData } from '../context/DataContext';

export default function Review() {
    const history = useNavigate();

    const {
      user,
      subscriptionPlans,
      displayCorrectPlan,
      describeBaseResume,
      describeTailoredResume,
      daysLeft
    } = useUser();
    const {
      handleManagePlan
    } = useData();
  return (
    <>
    <Header />
    <div className='pageWrapper'>
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
