import React from 'react';
import Header from '../components/header/Header';
import Footer from '../components/footer/Footer';
import BaseResumeTable from '../components/Review/BaseResumeTable';
import TailoredResumeTable from '../components/Review/TailoredResumeTable';
import '../views/main.css';

// import RecruitInfoTable from '../components/recruit/RecruitInfoTable';

export default function Review() {
  
  return (
    <>
    <Header />
    <div className='pageWrapper'>
      {/* {recruiter.id && (
        <div>
          <h3>Recruit Information</h3>
          <RecruitInfoTable />
        </div>
      )} */}
      <h1>Review</h1>
      <div>
        <BaseResumeTable />
        <TailoredResumeTable />
      </div>
    </div>
    <Footer />
    </>
  )
}
