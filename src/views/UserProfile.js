import React from 'react'
import Header from '../components/header/Header';
import Footer from '../components/footer/Footer'
import ContactCard from '../components/user/ContactCard'
import UserSetupModal from '../components/user/UserSetupModal';

export default function UserProfile() {

  return (
    <>
        <Header />
        <div className='pageWrapper'>
          <UserSetupModal/>
          <div className='secondaryPageWrapper'>
            <div className='rightDiv'>
              <ContactCard />
            </div>
          </div>
        </div>
        <Footer/>
    </>
  )
}
