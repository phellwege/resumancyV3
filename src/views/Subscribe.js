import React from 'react';
import Header from '../components/header/Header';
import Footer from '../components/footer/Footer';
import { Button, Card, Form, Tooltip, OverlayTrigger } from 'react-bootstrap';
import StripePricingTable from '../components/StripePricingTable'
import './main.css';

export default function Subscribe() {
  return (
    <>
        <Header />
            <div className='pageWrapper'>
                <div className='secondaryPageWrapper'>
                    <Card className='subscriptionCard'>
                        <Card.Body>
                            <div className='cardInnerDiv'>
                                <h5>Pick a Plan, Cancel Anytime</h5>
                                <p>
                                    Get started with a 7-day free trial! The Basic plan is $5/month and includes up to 5 tailored resumes and cover letters. The Premium plan is $15/month and gives you unlimited access.
                                </p>
                                <StripePricingTable />
                            </div>
                        </Card.Body>
                    </Card>
                </div>
            </div>
        <Footer />
    </>
  )
}
