import React from 'react'
import { useUser } from '../../context/UserContext';
import { Button, Card, OverlayTrigger, Tooltip} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { BsQuestionCircle } from "react-icons/bs";


export default function CurrentPlans() {
    const {
        user,
        subscriptionPlans,
        displayCorrectPlan,
        daysLeft,

        describeBaseResume,
        describeTailoredResume
    } = useUser();
    const {
        handleManagePlan
    } = useData();
    const history = useNavigate();
    


  return (
    <>
    <Card>
        <Card.Body>
            <div className='cardInnerDiv'>
                {!user?.id ? (
                    <>
                        <h5>Get Started for Free <br/> Plans from $5/month</h5>
                        <p className='alignLeft'>
                        Get started for just $5/month with our Basic plan—includes 1 base resume and 5 custom-tailored resumes and cover letters. Need more? Go Premium for $15/month and enjoy unlimited tailored resumes and cover letters. Try it free for 7 days—cancel anytime, or continue with Basic at $5/month after your trial ends.
                        </p>
                    </>
                ): (
                    <>
                        <h5>Current Plan: <br/>{displayCorrectPlan()}</h5>
                        <p><strong>Days left in Billing Cycle:</strong> {daysLeft}</p>
                        <div>
                            <p>
                                <strong>Usage:</strong>
                                <br/>
                                <strong>Base Resume: </strong>
                                ( {user.subscription?.usage.baseResume} / {subscriptionPlans[user.subscription.plan]?.baseResume} ) {' '}
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
                                <br/>
                                <strong>Tailored Resume(s): </strong>
                                ( {user.subscription?.usage.tailoredResumes} / {subscriptionPlans[user.subscription.plan]?.tailoredResumes} ){' '}
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
                            {user?.subscription.plan === 'price_1QrL8vEsYMRYIVaAx4EV21RU' || user?.subscription.plan === 'price_1QrL8vEsYMRYIVaAnoVKXDwS' ? (
                                <Button onClick={handleManagePlan}>
                                    Update Plan
                                </Button>
                            ): (
                                <Button onClick={
                                    ()=> {history('/Account');
                                    }}>
                                    Manage Account
                                </Button>
                            )}
                        </div>
                    </>    
                )}
                
            </div>
        </Card.Body>
    </Card>
    </>
  )
}
