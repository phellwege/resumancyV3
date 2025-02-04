import React, {useEffect} from 'react'
import {Button, Card} from 'react-bootstrap'
import { useUser } from '../../context/UserContext'


export default function CurrentSubscriptionCard() {
    const {
        user,
        subscriptionPlans
    } = useUser();

    const capitalizeAllLetters = (str) => str?.toUpperCase() || "";
    useEffect(() => {
        const script = document.createElement("script");
        script.src = "https://js.stripe.com/v3/pricing-table.js";
        script.async = true;
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, []);

  return (
    <>
        <Card>
            <Card.Body>
            <div className='cardInnerDiv'>
                <h4>Current Subscription</h4>
                <Card>
                    <Card.Body>
                        <h4>Plan:{' '}{capitalizeAllLetters(user.subscription.plan)}</h4>
                        {user?.subscription.plan !== 'premium' && (
                            <stripe-pricing-table
                                pricing-table-id="prctbl_1QoVz1EsYMRYIVaAOnhXLXrh"
                                publishable-key="pk_test_51NnmBdEsYMRYIVaA4kiZMQ7x5OcluaMWIPuifz7RsxhgIJc5d3RmzUNmhn3fUZnvKltX9fRrnWhivnZXz7g08qNZ00npXts5bt"
                            >
                            </stripe-pricing-table>
                        )}
                        <div>
                            <h5>Current Usage:</h5>
                            <h6>Base Resume:
                            ( {user.subscription.usage.baseResume} / {subscriptionPlans[user.subscription.plan].baseResume} )
                            </h6>
                            <h6>Tailored Resumes:
                            ( {user.subscription.usage.tailoredResumes} / {subscriptionPlans[user.subscription.plan].tailoredResumes} )
                            </h6>
                        </div>
                    </Card.Body>
                </Card>
            </div>
            </Card.Body>
        </Card>
    </>
  )
}
