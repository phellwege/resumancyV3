import React from 'react';
import { useNavigate } from 'react-router-dom';

import Header from '../components/header/Header';
import Footer from '../components/footer/Footer';
import BaseResumeTable from '../components/Review/BaseResumeTable';
import TailoredResumeTable from '../components/Review/TailoredResumeTable';
import { Button, Card} from "react-bootstrap";

import '../views/main.css';
import { useUser } from '../context/UserContext';

export default function Review() {
    const history = useNavigate();
    const capitalizeAllLetters = (str) => str?.toUpperCase() || "";
    const {
      user,
      subscriptionPlans
    } = useUser();
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
        {user.subscription.plan !== 'premium' && (
            <Card>
                <Card.Body>
                    <div>
                        <h5>Plan:{' '}{capitalizeAllLetters(user.subscription.plan)}</h5>
                        <h6>
                        Tailored Resume(s):
                        ( {user.subscription.usage.tailoredResumes} / {subscriptionPlans[user.subscription.plan].tailoredResumes} )
                        </h6>
                    </div>
                    <Button onClick={() => {
                        const userEmail = encodeURIComponent(user.contactInfo.email);
                        const stripeUrl = `https://billing.stripe.com/p/login/test_00gbLu5P7bjzcucdQQ?prefilled_email=${userEmail}`;
                        
                        window.open(stripeUrl, "_blank");
                    }}>
                        Upgrade Now
                    </Button>

                    {/* this will be roughly how to set this up for the user to redirect to their own payment portal */}
                    {/* <Button onClick={async () => {
                        try {
                            const response = await fetch("https://us-central1-your-project-id.cloudfunctions.net/createStripePortalSession", {
                                method: "POST",
                                headers: { "Content-Type": "application/json" },
                                body: JSON.stringify({ customerId: user.stripeCustomerId }) // Pass Stripe Customer ID
                            });

                            const data = await response.json();
                            if (data.url) {
                                window.location.href = data.url; // Redirect user to Stripe
                            } else {
                                console.error("Failed to create Stripe portal session.");
                            }
                        } catch (error) {
                            console.error("Error:", error);
                        }
                    }}>
                        Manage Subscription
                    </Button> */}

                </Card.Body>
            </Card>
        )}
      </div>
    </div>
    <Footer />
    </>
  )
}
