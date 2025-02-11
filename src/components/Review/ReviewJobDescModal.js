import React from 'react'
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import '../../views/main.css'
import { useUser } from '../../context/UserContext';

export default function ReviewJobDescModal() {
    const {
        reviewJobDescModal,
        handleCloseReviewJobDescModal,
        selectedTailoredResumeIdData,
        user
    } = useUser();
    
    if (!selectedTailoredResumeIdData) {
        console.warn("Warning: selectedTailoredResumeIdData is undefined. Preventing error.");
        return null; // Or show a placeholder UI
    }
    
    const { description } = selectedTailoredResumeIdData;

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
    show={reviewJobDescModal} 
    onHide={handleCloseReviewJobDescModal}
    size="lg"
    aria-labelledby="contained-modal-title-vcenter"
    centered
    >
        <Modal.Header closeButton  closeVariant='white'>
            <Modal.Title>Job Description</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <p>
            {renderTextWithNewLines(selectedTailoredResumeIdData.description)}
            </p>
        </Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseReviewJobDescModal}>
                Close
            </Button>
        </Modal.Footer>
    </Modal>
    </>
  )
}
