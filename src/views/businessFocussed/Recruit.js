import React from 'react'
import Header from '../../components/header/Header'
import Footer from '../../components/footer/Footer'
import { Card } from 'react-bootstrap'
import AddRecruit from '../components/recruit/AddRecruit'
import { useParams } from 'react-router-dom'
import './main.css';
import { useUser } from '../../context/UserContext'
import EditRecruit from '../components/recruit/EditRecruit'
export default function Recruit() {
    const {
        recruiter,
        recruitAction,
    } = useUser();
    const { recruitId } = useParams();
    const recruit = recruiter.recruits.find(recruit => recruit.id === recruitId);
  return (
    <>
        <Header />
        <div className='pageWrapper'>
            <div className='secondaryPageWrapper'>
                {recruitAction && recruitAction === 'adding' && (
                    <Card className='addRecruitCard'>
                        <Card.Body>
                            <div className='cardInnerDiv'>
                                <AddRecruit />
                            </div>
                        </Card.Body>
                    </Card>
                )}
                {recruitAction && recruitAction === 'editing' && (
                    <Card className='addRecruitCard'>
                        <Card.Body>
                            <div className='cardInnerDiv'>
                                <EditRecruit recruit={recruit}/>
                            </div>
                        </Card.Body>
                    </Card>
                )}
                {recruitAction && recruitAction === 'viewing' && (
                    <Card className='addRecruitCard'>
                        <Card.Body>
                            <div className='cardInnerDiv'>
                                Viewing
                            </div>
                        </Card.Body>
                    </Card>
                )}
            </div>
        </div>
        <Footer />
    </>
  )
}
