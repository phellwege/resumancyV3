import React, {useState} from 'react'
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { usePDF } from 'react-to-pdf';
import DefaultResumeStyle from './resumeStyles/defaultResumeStyle';
import ResumeStyle2 from './resumeStyles/resumeStyle2';

import '../../views/main.css'
import { useUser } from '../../context/UserContext';
import EditResume from './editResume';

export default function ReviewBaseResumeModal() {
    const {
        reviewResumeModal,
        handleCloseReviewResumeModal,
        user
    } = useUser();
    const [edit, setEdit] = useState(false);
    const handleEditToggle = () => {
        setEdit(prevState => !prevState);
    };
    const [isGenPDF, setIsGenPDF] = useState(false);
    const { toPDF, targetRef } = usePDF({filename:`${user.firstName}_${user.lastName}_Resume.pdf`});
    const handleToPDF = async () => {
        await setIsGenPDF(true);
        toPDF();
        setIsGenPDF(false);
    };
  return (
    <>
    <Modal 
    show={reviewResumeModal} 
    onHide={handleCloseReviewResumeModal}
    size="lg"
    aria-labelledby="contained-modal-title-vcenter"
    centered
    >
        <Modal.Header closeButton>
            <div className='reviewButton'>
                <Modal.Title>Review Base Resume</Modal.Title>
                <Button 
                    aria-label='download pdf button'
                    onClick={() => handleToPDF()}
                >
                    Download
                </Button>
            </div>
        </Modal.Header>
        <Modal.Body ref={targetRef} className='reviewSize'>
            {!edit ? (
                    <ResumeStyle2/>
                ) : (
                    <EditResume/>
                )
            }
        </Modal.Body>
        <Modal.Footer>
            <Button variant="primary" onClick={handleCloseReviewResumeModal}>
                Continue
            </Button>
            <Button variant="warning" onClick={() => handleEditToggle()}>
                {edit ? (
                    <>Stop Edit</>
                ):(
                    <>Edit</>
                )}
            </Button>
            <Button variant="secondary" onClick={handleCloseReviewResumeModal}>
                Close
            </Button>
            
        </Modal.Footer>
    </Modal>
    </>
  )
}
