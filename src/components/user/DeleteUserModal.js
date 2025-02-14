import React from 'react'
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { useUser } from '../../context/UserContext'
import { useData } from '../../context/DataContext';
export default function DeleteUserModal() {
    const {
        deleteAcctModal,
        handleCloseDeleteAcctModal,
        user
    } = useUser();
    const {
        deleteUserAccount
    } = useData();
  return (
    <>
        <Modal 
    show={deleteAcctModal} 
    onHide={handleCloseDeleteAcctModal}
    size="lg"
    aria-labelledby="contained-modal-title-vcenter"
    centered
    >
        <Modal.Header closeButton  closeVariant='white'>
            <Modal.Title>Delete Account</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <div className='modalBodyWrap' id='deleteAcctModal'>
                <h5>
                    Are you sure you want to delete your account? 
                </h5>
                <p>
                What happens when you delete your account? All your account information will be deleted from the database, and any saved resumes you have will be lost. Any outstanding subscription plans you are signed up for will be cancelled immediately, and the service will no longer be accessible to you.
                </p>
                <p>
                    <strong>THIS ACTION CANNOT BE REVERSED</strong>
                </p>
            </div>
        </Modal.Body>
        <Modal.Footer>
            <Button 
                variant="danger" 
                onClick={() => deleteUserAccount(user.id, user.stripeCustomerId)}
            >
                Delete
            </Button>
            <Button 
                variant="secondary" 
                onClick={handleCloseDeleteAcctModal}
            >
                Cancel
            </Button>
        </Modal.Footer>
    </Modal>
    </>
  )
}
