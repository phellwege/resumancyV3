import React, {useState} from 'react'
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import '../../views/main.css'
import { useUser } from '../../context/UserContext';
import EditCoverLetter from './editCoverLetter';

export default function ReviewCoverLetterModal() {
    const {
        reviewCoverLetterModal,
        handleCloseReviewCoverLetterModal,
        user
    } = useUser();
    const [edit, setEdit] = useState(false);
    
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
            {!edit ? (
            <p>
            {renderTextWithNewLines(user.coverLetter.response)}
            </p>
            ) : (
                <EditCoverLetter />
            )}
        </Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseReviewCoverLetterModal}>
                Close
            </Button>
            <Button variant="warning" onClick={() => setEdit(!edit)}>
                {edit ? 'Stop Edit' : 'Edit'}
            </Button>
        </Modal.Footer>
    </Modal>
    </>
  )
}
