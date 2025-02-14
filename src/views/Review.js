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
        {(user.subscription.plan === 'price_1QrL8vEsYMRYIVaAx4EV21RU' || user.subscription.plan === 'price_1QrL8vEsYMRYIVaAnoVKXDwS') && (
          <Card>
              <Card.Body>
              <div className="cardInnerDiv p-3">
                    <h4 className="mb-3">Subscription Plan</h4>
                    <h6 className="mb-2">
                      <strong>Current Plan: {displayCorrectPlan()}</strong> 
                    </h6>
                    <hr className="my-3" />
                    <div className="usage-info mb-3">
                      <h6 className="mb-2">Current Usage</h6>
                      <p className="mb-1">
                        <strong>Base Resume:</strong> {user.subscription?.usage.baseResume} / {subscriptionPlans[user.subscription.plan]?.baseResume}
                        <OverlayTrigger 
                            overlay={
                            <Tooltip id="tooltip">
                                {describeBaseResume}
                            </Tooltip>
                            }>
                            <span className="question-icon">
                                <BsQuestionCircle />
                            </span>
                        </OverlayTrigger>
                      </p>
                      <p>
                        <strong>Tailored Resume(s):</strong> {user.subscription?.usage.tailoredResumes} / {subscriptionPlans[user.subscription.plan]?.tailoredResumes}
                        <OverlayTrigger 
                            overlay={
                            <Tooltip id="tooltip">
                                {describeTailoredResume}
                            </Tooltip>
                            }>
                            <span className="question-icon">
                                <BsQuestionCircle />
                            </span>
                        </OverlayTrigger>
                      </p>
                    </div>
                    <hr className="my-3" />
                    <p className="mb-4">
                      <strong>Days left in Billing Cycle:</strong> {daysLeft}
                    </p>
                    <div className="text-center">
                      <Button variant="primary" onClick={handleManagePlan}>
                        Update Plan
                      </Button>
                    </div>
                  </div>
              </Card.Body>
          </Card>
        )}
      </div>
    </div>
    <Footer />
    </>
  )
}
