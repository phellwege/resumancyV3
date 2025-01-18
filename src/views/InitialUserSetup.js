import React from 'react'
import Header from '../components/header/Header';
import Footer from '../components/footer/Footer';
import { Button, Card, Alert, Form, Tooltip} from 'react-bootstrap';
import './main.css';


export default function InitialUserSetup() {
  return (
    <>
    <Header />
    <div className='pageWrapper'>
        <div className='secondaryPageWrapper'>
            <div>
                <Card>
                    <Card.Body>
                        <div className='cardInnerDiv'>
                            Finish your Profile
                            <Form>
                                <Form.Group>

                                </Form.Group>
                            </Form>
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
