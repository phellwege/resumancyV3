import React, { useEffect } from 'react';
import { useUser } from '../context/UserContext';
import { useAuth } from '../context/AuthContext';

const StripePricingTable = () => {
  const {
    user
  } = useUser();
  const {
    setLoading
  } = useAuth()

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

  return (
    <>
      <stripe-pricing-table
      pricing-table-id="prctbl_1QrLB9EsYMRYIVaAT1qV5Q4H"
      publishable-key="pk_live_51NnmBdEsYMRYIVaAunenBfJtxFr8cXbFofZkjIKdWvBxOBaigJptlp7O803BgYaWnZIgmpm6kEitJ4VLWs1PRiZl00NEXjL08i"
      customer-email={user.contactInfo.email}
      customer-id={user.stripeCustomerId}
      client-reference-id={user.id}
      >
      </stripe-pricing-table>
    </>
  );
};

export default StripePricingTable;
