import React, { useEffect } from 'react';
import { useUser } from '../context/UserContext';

const StripePricingTable = () => {
  const {
    user
  } = useUser();

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
      <stripe-pricing-table
      pricing-table-id="prctbl_1Qj47YEsYMRYIVaA31CZAp2S"
      publishable-key="pk_test_51NnmBdEsYMRYIVaA4kiZMQ7x5OcluaMWIPuifz7RsxhgIJc5d3RmzUNmhn3fUZnvKltX9fRrnWhivnZXz7g08qNZ00npXts5bt"
      >
      </stripe-pricing-table>
    </>
  );
};

export default StripePricingTable;
