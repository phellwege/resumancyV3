import React, {useState} from 'react'
import Header from '../components/header/Header';
import Footer from '../components/footer/Footer';
import { Button, Card } from 'react-bootstrap';
import { useUser } from '../context/UserContext';
import { useAuth } from '../context/AuthContext';

export default function Account() {
  const {
    displayCorrectPlan,
    user
  } = useUser();
  const {
    setLoading
  } = useAuth()
  const [referralLink, setReferralLink] = useState('');
  const [referralCount, setReferralCount] = useState(0);

  const handleManagePlan = async () => {
    setLoading(true);
    try {
      // Replace the URL with your deployed Firebase function endpoint if necessary
      const response = await fetch('https://us-central1-resumancy.cloudfunctions.net/createStripePortalSession-createStripePortalSession', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customerId: user.stripeCustomerId }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Failed to create Stripe portal session: ${errorData.error}`);
      }
      const data = await response.json();
      // Redirect the user to the Stripe billing portal
      window.location.href = data.url;
    } catch (error) {
      console.error('Error redirecting to Stripe portal:', error);
      // Optionally, show an error notification to the user here
    }
    setLoading(false);
  };

  const handleDeleteAccount = () => {
    if (window.confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      // deleteUserAccount(); // Your function to delete the account
    }
  };
  
  return (
    <>
        <Header />
        <div className='pageWrapper'>
            <div className='secondaryPageWrapper'>
              <div className='leftDiv'>
                <Card>
                  <Card.Body>
                    <div className='cardInnerDiv'>
                    <h4>Subscription Plan</h4>
                    <h6>Current Plan:{' '}{displayCorrectPlan()}</h6>
                    <div>
                      <Button  onClick={handleManagePlan}>
                        Manage Plan
                      </Button>  
                    </div>
                    </div>
                  </Card.Body>
                </Card>
                <Card>
                  <Card.Body>
                    <div className='cardInnerDiv'>
                      <h4>Manage your Account</h4>
                      <div>
                      <Button 
                        variant='danger' 
                        onClick={handleDeleteAccount}>
                          Delete My Account
                      </Button>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </div>
              <div className='rightDiv'>
              <Card>
              <Card.Body>
                <h4>Referral Program</h4>
                <p>Invite your friends and earn rewards!</p>
                <p>Your Referral Link:</p>
                <input type='text' value={referralLink} readOnly className='form-control' />
                <p>Successful Referrals: <strong>{referralCount}</strong></p>
                <Button onClick={() => navigator.clipboard.writeText(referralLink)}>Copy Link</Button>
              </Card.Body>
            </Card>
                <Card>
                  <Card.Body>
                    <div className='cardInnerDiv'>
                      <h4>Leave a review</h4>
                      <div>
                        Review thing, store rating in new object
                        <br/>
                        <Button>
                          Submit
                        </Button> 
                      </div>
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
