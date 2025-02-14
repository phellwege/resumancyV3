import React from 'react'
import Header from '../components/header/Header';
import Footer from '../components/footer/Footer';
import { Button, Card, Tooltip, OverlayTrigger } from 'react-bootstrap';
import { BsQuestionCircle } from "react-icons/bs";

import './main.css';
import { useUser } from '../context/UserContext';
import { useData } from '../context/DataContext';

export default function OverLimit() {
    const {
        user, 
        subscriptionPlans, 
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
            <div className='secondaryPageWrapper'>
                <div className='leftDiv'>
                    <Card>
                        <Card.Body>
                            <div className='cardInnerDiv'>
                                <h6>Upgrade Your Account to Continue</h6>
                                <p>You've reached your plan limit. Upgrade now to continue creating resumes, or wait until the next billing cycle.</p>
                                <hr className="my-3" />
                                <h6 className="mb-2">Usage</h6>
                                <p className="mb-1">
                                <strong>Base Resume:</strong> {user.subscription?.usage.baseResume} / {subscriptionPlans[user.subscription.plan]?.baseResume}
                                <OverlayTrigger 
                                    overlay={
                                    <Tooltip id="tooltip-base">
                                        {describeBaseResume}
                                    </Tooltip>
                                    }
                                >
                                    <span className="question-icon" style={{ verticalAlign: 'super', marginLeft: '4px', cursor: 'pointer' }}>
                                    <BsQuestionCircle size={17} />
                                    </span>
                                </OverlayTrigger>
                                </p>
                                <p>
                                <strong>Tailored Resume(s):</strong> {user.subscription?.usage.tailoredResumes} / {subscriptionPlans[user.subscription.plan]?.tailoredResumes}
                                <OverlayTrigger 
                                    overlay={
                                    <Tooltip id="tooltip-tailored">
                                        {describeTailoredResume}
                                    </Tooltip>
                                    }
                                >
                                    <span className="question-icon" style={{ verticalAlign: 'super', marginLeft: '4px', cursor: 'pointer' }}>
                                    <BsQuestionCircle size={17} />
                                    </span>
                                </OverlayTrigger>
                                </p>
                                <hr className="my-3" />
                                <p className="mb-4">
                                    <strong>Days left in Billing Cycle:</strong> {daysLeft}
                                </p>
                                <Button onClick={handleManagePlan}>
                                    Upgrade
                                </Button>
                                
                            </div>
                        </Card.Body>
                    </Card>
                </div>
            </div>
        </div>
        <Footer />
    </>
  )
}
