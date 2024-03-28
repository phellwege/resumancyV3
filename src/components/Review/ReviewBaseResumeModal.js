import React from 'react'
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import '../../views/main.css'
import { useUser } from '../../context/UserContext';
export default function ReviewBaseResumeModal() {
    const {
        reviewBaseResumeModal,
        handleCloseReviewBaseResumeModal
    } = useUser();

  return (
    <>
    <Modal 
    show={reviewBaseResumeModal} 
    onHide={handleCloseReviewBaseResumeModal}
    size="lg"
    aria-labelledby="contained-modal-title-vcenter"
    centered
    >
        <Modal.Header closeButton>
            <Modal.Title>Review Base Resume</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            
        </Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseReviewBaseResumeModal}>
                Close
            </Button>
            <Button variant="primary" onClick={handleCloseReviewBaseResumeModal}>
                Continue
            </Button>
        </Modal.Footer>
    </Modal>
    </>
  )
}
