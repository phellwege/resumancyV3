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
                    <div>
                        <h4>User Information</h4>
                        <div className='leftShifted'>
                        {user.firstName}{' '}{user.lastName}
                        <br/>
                        {user.jobTitle}
                        <br/>
                        {user.contactInfo.phone}
                        <br/>
                        {user.contactInfo.email}
                        <br/>
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
                        <br />
                        {user.address && (
                            <>
                            {user.address.street && (
                                <>
                                    {user.address.street}{' '}
                                </>
                            )}
                            {user.address.appt && (
                                <>
                                    {user.address.appt}
                                </>
                            )}
                            <br/>
                            {user.address.city && (
                                <>
                                    {user.address.city}{' '}
                                </>
                            )}
                            {user.address.state && (
                                <>
                                    {user.address.state}{' '}
                                </>
                            )}
                            {user.address.zip && (
                                <>
                                    {user.address.zip}{' '}
                                </>
                            )}
                            </>
                        )}
                        </div>
                        <Button onClick={handleOpenSetupUserModal}>Edit</Button>
                    </div>
                </div>
            </Card.Body>
        </Card>
    </>
  )
}
