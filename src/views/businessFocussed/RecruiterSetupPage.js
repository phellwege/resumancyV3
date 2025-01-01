import React, {useState, useEffect} from 'react';
import { Form, Card, Button } from 'react-bootstrap';
import Header from '../../components/header/Header';
import Footer from '../../components/footer/Footer';
import { useUser } from '../../context/UserContext';

import './main.css';
import AddressForm from '../../components/user/AddressForm';
import SelectRecruiterAvatarModal from '../components/recruit/SelectRecruiterAvatarModal';
export default function BusinessSetupPage() {
    const {
        user,
        recruiter,
        recruit,
        handleOpenSelectRecruiterAvatar,
        handleOpenBusinessRegModal,
        handleCloseBusinessRegModal,
    } = useUser();
    const [finishingTouches, setFinishingTouches] = useState(false)
    useEffect(() => {
      const script = document.createElement('script');
      script.src = 'https://js.stripe.com/v3/pricing-table.js';
      script.async = true;
      document.body.appendChild(script);
  
      return () => {
        document.body.removeChild(script);
      };
    }, []);

  return (
    <>
    <Header />
    <SelectRecruiterAvatarModal />
    <div className='pageWrapper'>
      {!finishingTouches && (
        <div className='secondaryPageWrapper'>
        <div className='leftDiv'>
          <Card>
            <Card.Body>
              <div className='cardInnerDiv'>
                <h3>Recruiter Details</h3>
                <Form>
                  <Form.Group>
                    <Form.Label>First Name</Form.Label>
                    <Form.Control
                      placeholder='Enter First Name'
                    ></Form.Control>
                    <Form.Label>Last Name</Form.Label>
                    <Form.Control
                      placeholder='Enter Last Name'
                    ></Form.Control>
                    <Form.Label>Phone</Form.Label>
                    <Form.Control
                      placeholder='Enter Phone'
                    ></Form.Control>
                    </Form.Group>
                  <AddressForm />
                </Form>
              </div>
            </Card.Body>
          </Card>
        </div>
        <div className='centerDiv'>
          <h5>Pricing</h5>
          <p>All of our Plans come with a complimentary 7-day trial period, allowing you to assess their suitability before making a commitment.</p>
          <p>In consideration of your monthly recruitment volume, we advise starting with <b>Tier {recruiter.recruitTier}</b>. Nevertheless, you have the flexibility to begin with the basic tier and scale up as your recruitment numbers grow.</p>
          <Button 
          onClick={() => {
            setFinishingTouches(true)
            }}
          >
            Continue
          </Button>
        </div>
        <div className='rightDiv' id='recruiterDefaultAvatar'>
          <img src={user.avatarImg} alt='default avatar' />
          <Button 
          onClick={
            handleOpenSelectRecruiterAvatar
            }
          >
            Change Avatar
          </Button>
        </div>
      </div>
      )}
      {finishingTouches && (
        <div className='secondaryPageWrapper'>
          <Card id='paymentProcessorCard'>
              <Card.Body>
                <div className='cardInnerDiv'>
                  
                  <div className='tiersSegments' id='paymentProcessorDiv'>
                    <stripe-pricing-table
                      pricing-table-id="prctbl_1Oz3JAEsYMRYIVaAPOaOOo0r"
                      publishable-key="pk_live_51NnmBdEsYMRYIVaAunenBfJtxFr8cXbFofZkjIKdWvBxOBaigJptlp7O803BgYaWnZIgmpm6kEitJ4VLWs1PRiZl00NEXjL08i"
                    />
                  </div>
                </div>
              </Card.Body>
            </Card>
        </div>
      )}
      
    </div>
      <Footer />
    </>
  )
}
