import React from 'react'
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { useUser } from '../../context/UserContext'
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
export default function DeleteUserModal() {
    const {
        deleteAcctModal,
        handleCloseDeleteAcctModal,
    } = useUser();
    const { logout } = useAuth();
    const navigate = useNavigate();
    const handleDelete = async () => {
        await logout();
        handleCloseDeleteAcctModal();
        navigate('/');
    };
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
            <Modal.Title>Delete my data</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <div className='modalBodyWrap' id='deleteAcctModal'>
                <h5>
                    Delete everything Resumancy saved in this browser?
                </h5>
                <p>
                This removes your profile, resumes, cover letters and saved API key from this browser's storage. Nothing exists on a server, so there is no other copy unless you exported one.
                </p>
                <p>
                    <strong>THIS ACTION CANNOT BE REVERSED</strong>
                </p>
            </div>
        </Modal.Body>
        <Modal.Footer>
            <Button 
                variant="danger" 
                onClick={handleDelete}
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
