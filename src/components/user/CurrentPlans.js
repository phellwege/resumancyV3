import React from 'react'
import { useUser } from '../../context/UserContext';
import { Button, Card} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

export default function CurrentPlans() {
    const {
        user,
        subscriptionPlans
    } = useUser();
    const capitalizeAllLetters = (str) => str?.toUpperCase() || "";
    const history = useNavigate();

  return (
    <>
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
                {user?.subscription.plan === 'price_1QrL8vEsYMRYIVaAx4EV21RU' && (
                    <>
                        <h5>Current Plan: <br/>BASIC</h5>
                        <div>
                            <h6>
                                Usage:<br/>
                                Base Resume:
                                ( {user.subscription?.usage.baseResume} / {subscriptionPlans[user.subscription.plan]?.baseResume} )
                                <br/>
                                Tailored Resume(s):
                                ( {user.subscription?.usage.tailoredResumes} / {subscriptionPlans[user.subscription.plan]?.tailoredResumes} )
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
    </>
  )
}
