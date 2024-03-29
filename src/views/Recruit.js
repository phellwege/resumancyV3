import React from 'react'
import Header from '../components/header/Header'
import Footer from '../components/footer/Footer'
import { Card } from 'react-bootstrap'
import AddRecruit from '../components/recruit/AddRecruit'

export default function Recruit() {
  return (
    <>
        <Header />
        <div className='pageWrapper'>
            <div className='secondaryPageWrapper'>
                <Card>
                    <Card.Body>
                        <AddRecruit />
                    </Card.Body>
                </Card>
            </div>
        </div>
        <Footer />
    </>
  )
}
