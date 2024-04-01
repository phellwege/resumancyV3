import React from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/header/Header';
import Footer from '../components/footer/Footer';
import { useUser } from '../context/UserContext';
export default function RecruitCreateResume() {
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
            {recruitAction && recruitAction === 'RecruitCreatingBaseResume' && (
                <>
                    {recruit.firstName} Base Resume
                </>
            )}
            {recruitAction && recruitAction === 'RecruitCreatingTailoredResume' && (
                <>
                    Tailored Resume
                </>
            )}
        </div>
    </div>
    <Footer />
    </>
  )
}
