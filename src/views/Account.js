import React, {useState} from 'react'
import Header from '../components/header/Header';
import Footer from '../components/footer/Footer';
import { Button, Card } from 'react-bootstrap';
import { useUser } from '../context/UserContext';
import { useData } from '../context/DataContext';

export default function Account() {
  const {
    displayCorrectPlan,
    user
  } = useUser();
  const {
    handleManagePlan
  } = useData();
  const [referralLink, setReferralLink] = useState('');
  const [referralCount, setReferralCount] = useState(0);

  

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
                      <h4>Delete Account</h4>
                      <p>What happens when you delete your account? All your account information will be deleted from the database, and any saved resumes you have will be lost. Any outstanding subscription plans you are signed up for will be cancelled immediately, and the service will no longer be accessible to you.</p>
                      <p><strong>This action cannot be reversed.</strong></p>
                      <div>
                      <Button 
                        variant='danger' 
                        onClick={handleDeleteAccount}>
                          Delete
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
