import React from 'react'
import {Button, Card} from 'react-bootstrap'
import { useUser } from '../../context/UserContext'


export default function CurrentSubscriptionCard() {
    const {
        user,
        subscriptionPlans
    } = useUser();

    const capitalizeAllLetters = (str) => str?.toUpperCase() || "";

  return (
    <>
        <Card>
            <Card.Body>
            <div className='cardInnerDiv'>
                <h4>Current Subscription</h4>
                <Card>
                    <Card.Body>
                        <h4>Plan:{' '}{capitalizeAllLetters(user.subscription.plan)}</h4>
                        <h5>Usage:</h5>
                        <div>
                            <h6>Base Resume:
                            ( {user.subscription.usage.baseResume} / {subscriptionPlans[user.subscription.plan].baseResume} )
                            </h6>
                        </div>
                        <div>
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
