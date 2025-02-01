import React, {useState} from 'react'
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import '../../views/main.css'
import { useUser } from '../../context/UserContext';
import EditCoverLetter from './editCoverLetter';
import { MdContentCopy } from "react-icons/md";

export default function ReviewCoverLetterModal() {
    const {
        reviewCoverLetterModal,
        handleCloseReviewCoverLetterModal,
        selectedCoverLetterIdData,
        user
    } = useUser();

    const [edit, setEdit] = useState(false);
    const [showAlert, setShowAlert] = useState(false);

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

    const handleCopy = () => {
        const textToCopy = selectedCoverLetterIdData.response;
        if (textToCopy) {
            navigator.clipboard.writeText(textToCopy)
                .then(() => {
                    setShowAlert(true);
                    setTimeout(() => setShowAlert(false), 3500);
                })
                .catch(() => {
                    alert('Failed to copy text!');
                });
        }
    };

  return (
    <>
    <Modal 
    show={reviewCoverLetterModal} 
    onHide={() => {
        handleCloseReviewCoverLetterModal(); 
        setEdit(false);
    }}
    size="lg"
    aria-labelledby="contained-modal-title-vcenter"
    centered
    >
        <Modal.Header closeButton  closeVariant='white'>
            <Modal.Title>Review Cover Letter</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            {!edit ? (
            <div>
            <MdContentCopy style={{ cursor: 'pointer' }} onClick={handleCopy}/>
            {showAlert && (
                <p
                    style={{
                        color: 'green',
                        fontWeight: 'bold',
                        marginTop: '10px',
                    }}
                >
                    Text Successfully Copied!
                </p>
            )}
            <div>
                {selectedCoverLetterIdData?.response ? renderTextWithNewLines(selectedCoverLetterIdData.response) : "No cover letter available."}
            </div>
            </div>
            ) : (
                <EditCoverLetter/>
            )}
        </Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" onClick={() =>{
                handleCloseReviewCoverLetterModal();
                setEdit(false);
            }}>
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
