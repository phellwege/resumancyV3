import React from 'react';
import { useUser } from '../../context/UserContext';
import { Button, Card, OverlayTrigger, Tooltip } from 'react-bootstrap';
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
  const { handleManagePlan } = useData();
  const history = useNavigate();

  return (
    <Card className="mb-4 shadow-sm">
        <Card.Body>
            <div className="cardInnerDiv p-3">
            {!user?.id ? (
                <>
                <h4 className="mb-3">
                    Get Started for Free <br /> Plans from $5/month
                </h4>
                <p className="alignLeft">
                    Get started for just $5/month with our Basic plan—includes 1 base resume and 5 custom-tailored resumes and cover letters. Need more? Go Premium for $15/month and enjoy unlimited tailored resumes and cover letters. Try it free for 7 days—cancel anytime, or continue with Basic at $5/month after your trial ends.
                </p>
                </>
            ) : (
                <>
                <h5 className="mb-3">Current Plan: <br />{displayCorrectPlan()}</h5>
                <hr className="my-3" />
                <div className="usage-info mb-3">
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
                </div>
                <hr className="my-3" />
                <p className="mb-4">
                    <strong>Days left in Billing Cycle:</strong> {daysLeft}
                </p>
                <div className="text-center">
                    {(user?.subscription.plan === 'price_1QrL8vEsYMRYIVaAx4EV21RU' || user?.subscription.plan === 'price_1QrL8vEsYMRYIVaAnoVKXDwS') ? (
                    <Button variant="primary" onClick={handleManagePlan}>
                        Update Plan
                    </Button>
                    ) : (
                    <></>
                    )}
                </div>
                </>
            )}
            </div>
        </Card.Body>
    </Card>
    );
}
