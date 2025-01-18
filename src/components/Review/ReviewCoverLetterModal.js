import React from 'react'
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import '../../views/main.css'
import { useUser } from '../../context/UserContext';
export default function ReviewCoverLetterModal() {
    const {
        reviewCoverLetterModal,
        handleCloseReviewCoverLetterModal
    } = useUser();

  return (
    <>
    <Modal 
    show={reviewCoverLetterModal} 
    onHide={handleCloseReviewCoverLetterModal}
    size="lg"
    aria-labelledby="contained-modal-title-vcenter"
    centered
    >
        <Modal.Header closeButton  closeVariant='white'>
            <Modal.Title>Review Cover Letter</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            
        </Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseReviewCoverLetterModal}>
                Close
            </Button>
            <Button variant="primary" onClick={handleCloseReviewCoverLetterModal}>
                Continue
            </Button>
        </Modal.Footer>
    </Modal>
    </>
  )
}
