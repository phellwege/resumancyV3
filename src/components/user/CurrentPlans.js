import React from 'react'
import { useUser } from '../../context/UserContext';
import { Button, Card} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

export default function CurrentPlans() {
    const {
        user,
        subscriptionPlans,
        displayCorrectPlan
    } = useUser();
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
                        <div>
                            <h6>
                                Usage:<br/>
                                Base Resume:
                                ( {user.subscription?.usage.baseResume} / {subscriptionPlans[user.subscription.plan]?.baseResume} )
                                <br/>
                                Tailored Resume(s):
                                ( {user.subscription?.usage.tailoredResumes} / {subscriptionPlans[user.subscription.plan]?.tailoredResumes} )
                            </h6>
                            {user?.subscription.plan === 'price_1QrL8vEsYMRYIVaAx4EV21RU' || user?.subscription.plan === 'price_1QrL8vEsYMRYIVaAnoVKXDwS' ? (
                                <Button>
                                    Upgrade Plan
                                </Button>
                            ): (
                                <Button>
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
