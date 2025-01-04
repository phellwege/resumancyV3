import React, {useState} from 'react'
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';

import DefaultResumeStyle from './resumeStyles/defaultResumeStyle';
import ResumeStyle2 from './resumeStyles/resumeStyle2';

import '../../views/main.css'
import { useUser } from '../../context/UserContext';
import EditResume from './editResume';
export default function ReviewBaseResumeModal() {
    const {
        reviewBaseResumeModal,
        handleCloseReviewBaseResumeModal,
        user
    } = useUser();
    const [edit, setEdit] = useState(false);
    const handleEditToggle = () => {
        setEdit(prevState => !prevState);
    };
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
            {!edit ? (
                    <ResumeStyle2/>
                ) : (
                    <EditResume/>
                )
            }
        </Modal.Body>
        <Modal.Footer>
            <Button variant="primary" onClick={handleCloseReviewBaseResumeModal}>
                Continue
            </Button>
            <Button variant="warning" onClick={() => handleEditToggle()}>
                {edit ? (
                    <>Stop Edit</>
                ):(
                    <>Edit</>
                )}
            </Button>
            <Button variant="secondary" onClick={handleCloseReviewBaseResumeModal}>
                Close
            </Button>
        </Modal.Footer>
    </Modal>
    </>
  )
}
