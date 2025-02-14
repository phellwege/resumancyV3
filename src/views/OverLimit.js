import React from 'react'
import Header from '../components/header/Header';
import Footer from '../components/footer/Footer';
import { Button, Card } from 'react-bootstrap';
import './main.css';

export default function OverLimit() {
  return (
    <>
        <Header />
        <div className='pageWrapper'>
            <div className='secondaryPageWrapper'>
                <div className='leftDiv'>
                    <Card>
                        <Card.Body>
                            <div className='cardInnerDiv'>
                                <h6>Upgrade Your Account to Continue</h6>
                                <p>You're Currently at your plan limit, upgrade now to continue powering through resumes. Alternatively wait until the next billing cycle to continue.</p>
                                <Button>
                                    Upgrade
                                </Button>
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
