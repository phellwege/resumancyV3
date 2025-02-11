import React from 'react'
import {Button, Card} from 'react-bootstrap'
import { useUser } from '../../context/UserContext'

export default function ContactCard() {
    const {
        user,
        handleOpenSetupUserModal
    } = useUser();
  return (
    <>
        <Card>
            <Card.Body>
                <div className='cardInnerDiv'>
                        <h4>Profile Information</h4>
                        <h6>{user.firstName}{' '}{user.lastName}</h6>
                    <div className='userInfoCardInnerWrap'>
                        <div className='leftShifted'>
                        {user.jobTitle}
                        <br/>
                        {user.contactInfo.phone}
                        <br/>
                        {user.contactInfo.email}
                        <br/>
                        </div>
                        {user.contactInfo.socialMedia.length > 0 && (
                            <div className='socialMediaLinkColor'>
                                {user.contactInfo.socialMedia.map((account, index) => (
                                    <div key={index}>
                                        <a 
                                            href={account.url} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                        >
                                            {account.name}
                                        </a>
                                    </div>
                                ))}
                            </div>
                        )}
                        {/* <br /> */}
                        {user.address && (
                            <div>
                                <h6>Address:</h6>
                                {(user.address.street || user.address.appt) && (
                                    <>
                                        {user.address.street && `${user.address.street} `}
                                        {user.address.appt && user.address.appt}
                                        <br />
                                    </>
                                )}
                                {(user.address.city || user.address.state || user.address.zip) && (
                                    <>
                                        {user.address.city && `${user.address.city}, `}
                                        {user.address.state && `${user.address.state} `}
                                        {user.address.zip && user.address.zip}
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                    <br/>
                    <Button onClick={handleOpenSetupUserModal}>Edit</Button>
                </div>
            </Card.Body>
        </Card>
    </>
  )
}
