import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Card, Button } from 'react-bootstrap';
import Header from '../components/header/Header';
import Footer from '../components/footer/Footer';

import './main.css';
import { useUser } from '../context/UserContext';
import { useData } from '../context/DataContext';

export default function SuccessPage() {
  const navigate = useNavigate();
  const {
    displayCorrectPlan,
    user,
    setSuccessMessage,
    setError
  } = useUser();
  const { updateReferralOnSubscription } = useData();
  const isBasicUser = (user.subscription.plan === 'price_1QrL8vEsYMRYIVaAx4EV21RU' || user.subscription.plan === 'price_1QrL8vEsYMRYIVaAnoVKXDwS');

  useEffect(() => {
    // Check if a coupon code was applied during subscription
    const appliedCouponCode = sessionStorage.getItem('appliedCouponCode');
    
    if (appliedCouponCode && user.id) {
      const processReferral = async () => {
        try {
          const result = await updateReferralOnSubscription(user.id, appliedCouponCode);
          if (result.success) {
            console.log('Referral processed successfully');
            // Clear the stored coupon code
            sessionStorage.removeItem('appliedCouponCode');
          } else {
            console.error('Error processing referral:', result.message);
          }
        } catch (error) {
          console.error('Error processing referral:', error);
        }
      };
      
      processReferral();
    }
  }, [user.id, updateReferralOnSubscription]);

  return (
    <>
      <Header />
      <div className='pageWrapper'>
        <Container className="d-flex flex-column align-items-center justify-content-center min-vh-75 text-center">
          <Card className="shadow-lg rounded-3 p-4 text-center" style={{ maxWidth: '500px' }}>
            <Card.Body>
              <div className='cardInnerDiv'>
              <h4 className="fw-bold">🎉 Subscription Successful! 🎉</h4>
              <p className="fs-5">
                Thank you for subscribing to <strong>Resumancy</strong>! 
                You now have full access to all <strong>{displayCorrectPlan()}</strong> features. 
              </p>
              {isBasicUser ? (
                  <>
                    <p className="fs-6">
                      ✅ **5 tailored resumes per month**  
                      ✅ **Skill gap analysis included**  
                      🔓 **Upgrade to Premium for unlimited resumes & analyses!**
                    </p>
                    <Button 
                      variant="outline-warning" 
                      size="sm" 
                      onClick={() => navigate('/Upgrade')}
                    >
                      Upgrade to Premium
                    </Button>
                    <br/>
                    <br/>
                  </>
                ) : (
                  <p className="fs-6">
                    ✅ Unlimited tailored resumes & skill gap analysis  
                    You're all set to level up your career!
                  </p>
                )}
              <Button 
                variant="primary" 
                size="lg" 
                onClick={
                  () => navigate('/Create')
              }>
                Create Resume
              </Button>
              </div>
            </Card.Body>
          </Card>
        </Container>
      </div>
      <Footer />
    </>
  );
}
