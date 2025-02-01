import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { usePDF } from 'react-to-pdf';
import '../../views/main.css';
import { useUser } from '../../context/UserContext';
import EditResume from './editResume';
import ToggleStyle from './resumeStyles/ToggleStyle';
import DefaultResumeStyle from './resumeStyles/defaultResumeStyle';
import ResumeStyle2 from './resumeStyles/resumeStyle2';
import ResumeStyle3 from './resumeStyles/resumeStyle3';
import ResumeStyle4 from './resumeStyles/resumeStyle4';
import ResumeStyle5 from './resumeStyles/resumeStyle5';

const styleComponents = {
  style1: DefaultResumeStyle,
  style2: ResumeStyle2,
  style3: ResumeStyle3,
  style4: ResumeStyle4,
  style5: ResumeStyle5,
};

export default function ReviewBaseResumeModal() {
  const { 
    reviewResumeModal, 
    handleCloseReviewResumeModal, 
    user
  } = useUser();

  const [edit, setEdit] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState('style2');

  const { toPDF, targetRef } = usePDF({
    filename: `${user.firstName}_${user.lastName}_Resume.pdf`,
    options: { format: [8.5, 11] },
  });

  const handleToPDF = async () => {
    await toPDF();
  };

  const SelectedResumeComponent = styleComponents[selectedStyle];

  return (
    <>
      <Modal
        show={reviewResumeModal}
        onHide={() =>{
          handleCloseReviewResumeModal();
          setEdit(false);
        }}
        size="lg"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header closeButton closeVariant="white">
          <div className="reviewButton">
            <Modal.Title>Review Resume</Modal.Title>
            <div className='reviewResumeStyleToggleButtonGroup'>
                <ToggleStyle selectedStyle={selectedStyle} onStyleChange={setSelectedStyle} />
                <Button aria-label="download pdf button" onClick={handleToPDF}>
                Download
                </Button>
            </div>
          </div>
        </Modal.Header>
        <Modal.Body ref={targetRef} className="reviewSize">
          {!edit ? (
            <SelectedResumeComponent/>
          ) : (
            <EditResume/>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={handleCloseReviewResumeModal}>
            Continue
          </Button>
          <Button variant="warning" onClick={() => setEdit(!edit)}>
            {edit ? 'Stop Edit' : 'Edit'}
          </Button>
          <Button variant="secondary" onClick={handleCloseReviewResumeModal}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
