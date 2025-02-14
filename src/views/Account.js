import React, {useState} from 'react'
import Header from '../components/header/Header';
import Footer from '../components/footer/Footer';
import { Button, Card } from 'react-bootstrap';
import { useUser } from '../context/UserContext';
import { useData } from '../context/DataContext';
import DeleteUserModal from '../components/user/DeleteUserModal';

export default function Account() {
  const {
    displayCorrectPlan,
    user,
    setDeleteAcctModal,
    subscriptionPlans
  } = useUser();
  const {
    handleManagePlan
  } = useData();
  const [referralLink, setReferralLink] = useState('');
  const [referralCount, setReferralCount] = useState(0);

  const currentPeriodEndDate = new Date(user.subscription.currentPeriodEndDate);
  const now = new Date();
  const diffTime = currentPeriodEndDate - now;
  const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  const handleDeleteAccount = () => {
      setDeleteAcctModal(true);
  };
  
  return (
    <>
        <Header />
        <div className='pageWrapper'>
            <div className='secondaryPageWrapper'>
              <DeleteUserModal/>
              <div className='leftDiv'>
                <Card className="mb-4 shadow-sm">
                  <Card.Body>
                    <div className="cardInnerDiv p-3">
                      <h4 className="mb-3">Subscription Plan</h4>
                      <p className="mb-2">
                        <strong>Current Plan:</strong> {displayCorrectPlan()}
                      </p>
                      <hr className="my-3" />
                      <div className="usage-info mb-3">
                        <h6 className="mb-2">Current Usage</h6>
                        <p className="mb-1">
                          <strong>Base Resume:</strong> {user.subscription?.usage.baseResume} / {subscriptionPlans[user.subscription.plan]?.baseResume}
                        </p>
                        <p>
                          <strong>Tailored Resume(s):</strong> {user.subscription?.usage.tailoredResumes} / {subscriptionPlans[user.subscription.plan]?.tailoredResumes}
                        </p>
                      </div>
                      <hr className="my-3" />
                      <p className="mb-4">
                        <strong>Days left in Billing Cycle:</strong> {daysLeft}
                      </p>
                      <div className="text-center">
                        <Button variant="primary" onClick={handleManagePlan}>
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
                <div className='cardInnerDiv'>
                  <h4>Referral Program</h4>
                  <p>Invite your friends and earn rewards!</p>
                  <p>Your Referral Link:</p>
                  <input 
                    type='text' 
                    value={referralLink} 
                    readOnly className='form-control' 
                  />
                  <p>Successful Referrals: <strong>{referralCount}</strong></p>
                  <Button onClick={() => navigator.clipboard.writeText(referralLink)}>Copy Link</Button>
                </div>
              </Card.Body>
            </Card>
                {/* <Card>
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
                </Card> */}
              </div>
            </div>
        </div>
        <Footer />
    </>
  )
}
