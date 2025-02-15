import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Card, Button } from 'react-bootstrap';
import Header from '../components/header/Header';
import Footer from '../components/footer/Footer';

import './main.css';

export default function SuccessPage() {
  const navigate = useNavigate();

  return (
    <>
      <Header />
      <Container className="d-flex flex-column align-items-center justify-content-center min-vh-75 text-center">
        <Card className="shadow-lg rounded-3 p-4 text-center" style={{ maxWidth: '500px' }}>
          <Card.Body>
            <h1 className="text-success fw-bold">🎉 Subscription Successful!</h1>
            <p className="fs-5 text-muted">
              Thank you for subscribing to <strong>Resumancy</strong>! 
              You now have full access to all premium features, including unlimited tailored resumes and cover letters.
            </p>
            <Button variant="primary" size="lg" onClick={() => navigate('/dashboard')}>
              Go to Dashboard
            </Button>
          </Card.Body>
        </Card>
      </Container>
      <Footer />
    </>
  );
}
