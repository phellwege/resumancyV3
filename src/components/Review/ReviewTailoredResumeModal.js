import React from 'react'
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import '../../views/main.css'
import { useUser } from '../../context/UserContext';
export default function ReviewTailoredResumeResumeModal() {
    const {
        reviewTailoredResumeModal,
        handleCloseReviewTailoredResumeModal
    } = useUser();

  return (
    <>
    <Modal 
    show={reviewTailoredResumeModal} 
    onHide={handleCloseReviewTailoredResumeModal}
    size="lg"
    aria-labelledby="contained-modal-title-vcenter"
    centered
    >
        <Modal.Header closeButton>
            <Modal.Title>Review Tailored Resume</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            
        </Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseReviewTailoredResumeModal}>
                Close
            </Button>
            <Button variant="primary" onClick={handleCloseReviewTailoredResumeModal}>
                Continue
            </Button>
        </Modal.Footer>
    </Modal>
    </>
  )
}
