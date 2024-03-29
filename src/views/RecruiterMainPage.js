import React from 'react'
import Header from '../components/header/Header'
import Footer from '../components/footer/Footer'

import './main.css'
import { Button, Card } from 'react-bootstrap'
import RecruitInfoTable from '../components/recruit/RecruitInfoTable'
import { useNavigate } from 'react-router-dom'
export default function RecruiterMainPage() {
    const history = useNavigate()
  return (
    <>
        <Header />
        <div className='pageWrapper'>
            <div className='leftDiv' id='recruiterRecruitCard'>
                <Card>
                    <Card.Body>
                        <div className='cardInnerDiv'>
                            <h4>Recruits</h4>
                            <Button onClick={() => {history('/Recruit')}}>Add New Recruit</Button>
                            <h6>Review Recruits</h6>
                            <RecruitInfoTable />
                        </div>
                    </Card.Body>
                </Card>
            </div>
            <div className='secondaryPageWrapper'>
                <div className='leftDiv'>
                    <Card>
                        <Card.Body>
                            <div className='cardInnerDiv'>
                                <h5>Analytics</h5>
                            </div>
                        </Card.Body>
                    </Card>
                    </div>
                    <div className='rightDiv'>
                    <Card>
                        <Card.Body>
                            <div className='cardInnerDiv'>
                                <h5>Schedule</h5>
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
