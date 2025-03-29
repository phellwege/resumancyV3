import React, { useEffect, useState } from 'react';
import { useUser } from '../context/UserContext';
import { useAuth } from '../context/AuthContext';
import { Form, Button, InputGroup } from 'react-bootstrap';

const StripePricingTable = () => {
  const {
    user
  } = useUser();
  const {
    setLoading
  } = useAuth();
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState('');

  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://js.stripe.com/v3/pricing-table.js';
    script.async = true;
    script.onload = () => setLoading(false);
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleCouponChange = (e) => {
    setCouponCode(e.target.value);
  };

  const applyCoupon = () => {
    if (couponCode) {
      setAppliedCoupon(couponCode);
      // Store the coupon code in session storage for later use
      sessionStorage.setItem('appliedCouponCode', couponCode);
    }
  };

  return (
    <>
      <div className="mb-4">
        <Form.Label>Have a referral code?</Form.Label>
        <InputGroup>
          <Form.Control
            type="text"
            placeholder="Enter referral code"
            value={couponCode}
            onChange={handleCouponChange}
          />
          <Button 
            variant="outline-primary" 
            onClick={applyCoupon}
            disabled={!couponCode || couponCode === appliedCoupon}
          >
            Apply
          </Button>
        </InputGroup>
        {appliedCoupon && (
          <small className="text-success">
            Referral code {appliedCoupon} applied! You'll receive 20% off your subscription.
          </small>
        )}
      </div>
      
      <stripe-pricing-table
        pricing-table-id="prctbl_1QrLB9EsYMRYIVaAT1qV5Q4H"
        publishable-key="pk_live_51NnmBdEsYMRYIVaAunenBfJtxFr8cXbFofZkjIKdWvBxOBaigJptlp7O803BgYaWnZIgmpm6kEitJ4VLWs1PRiZl00NEXjL08i"
        customer-email={user.contactInfo.email}
        customer-id={user.stripeCustomerId}
        client-reference-id={user.id}
        coupon={appliedCoupon}
      >
      </stripe-pricing-table>
    </>
  );
};

export default StripePricingTable;
