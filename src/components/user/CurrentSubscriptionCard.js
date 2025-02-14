import React, {useEffect} from 'react'
import {Button, Card} from 'react-bootstrap'
import { useUser } from '../../context/UserContext'
import { useNavigate } from 'react-router-dom';


export default function CurrentSubscriptionCard() {
    const {
        user,
        displayCorrectPlan,
        subscriptionPlans,
        daysLeft
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
                <Card>
                    <Card.Body>
                        <h4>Plan:{' '}{displayCorrectPlan()}</h4>
                        <div>
                            <h5>Current Usage:</h5>
                            <p><strong>Days left in Billing Cycle:</strong> {daysLeft}</p>
                            <h6>Base Resume:
                            ( {user.subscription?.usage?.baseResume} / {subscriptionPlans[user.subscription.plan]?.baseResume} )
                            </h6>
                            <h6>Tailored Resumes:
                            ( {user.subscription?.usage?.tailoredResumes} / {subscriptionPlans[user.subscription.plan]?.tailoredResumes} )
                            </h6>
                        </div>
                    </Card.Body>
                </Card>
                <Button onClick={() => history('/Account')}>
                    Manage Account
                </Button>
            </div>
            </Card.Body>
        </Card>
    </>
  )
}
 