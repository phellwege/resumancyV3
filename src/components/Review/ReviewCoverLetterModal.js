import React from 'react'
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import '../../views/main.css'
import { useUser } from '../../context/UserContext';
export default function ReviewCoverLetterModal() {
    const {
        reviewCoverLetterModal,
        handleCloseReviewCoverLetterModal,
        user
    } = useUser();
    const renderTextWithNewLines = (text) => {
        if (text) {
            const lines = text.split('\n');
            return lines.map((line, index) => {
                const shouldIndent = line.startsWith('-');
                return (
                    <p key={index} className={shouldIndent ? 'indented' : ''} style={{ marginBottom: "5px" }}>{line}
                    </p>
                );
            });
        }
        return null;
    };
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
            <p>
            {renderTextWithNewLines(user.coverLetter.response)}
            </p>
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
