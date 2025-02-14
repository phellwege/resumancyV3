import React, {useEffect} from 'react'
import {Button, Card, Tooltip, OverlayTrigger} from 'react-bootstrap'
import { useUser } from '../../context/UserContext'
import { useNavigate } from 'react-router-dom';
import { BsQuestionCircle } from "react-icons/bs";



export default function CurrentSubscriptionCard() {
    const {
        user,
        displayCorrectPlan,
        subscriptionPlans,
        daysLeft,
        describeBaseResume,
        describeTailoredResume
    } = useUser();

    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://js.stripe.com/v3/pricing-table.js";
        script.async = true;
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    const history = useNavigate();
  return (
    <>
        <Card>
            <Card.Body>
            <div className='cardInnerDiv'>
                <h4>Current Subscription</h4>
                <h5 className="mb-3">Current Plan: <br />{displayCorrectPlan()}</h5>
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
                <Button onClick={() => history('/Account')}>
                    Manage Account
                </Button>
            </div>
            </Card.Body>
        </Card>
    </>
  )
}
 