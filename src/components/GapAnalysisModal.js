import React from 'react'
import { useUser } from '../context/UserContext';
import Modal from 'react-bootstrap/Modal';
import '../views/main.css'

export default function GapAnalysisModal() {
    const {
        selectedGapAnalysis,
        gapAnalysisModal,
        handleCloseGapAnalysisModal
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
            show={gapAnalysisModal}
            onHide={handleCloseGapAnalysisModal}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            centered
        >
            <Modal.Header closeButton closeVariant='white'>
                <Modal.Title>Skill Gap Analysis</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className='modalBodyWrap'>
                { selectedGapAnalysis ? (
                    <p>{renderTextWithNewLines(selectedGapAnalysis)}</p>
                ) : (
                    <p>No skill gap analysis available.</p>
                ) }
                </div>
            </Modal.Body>
        </Modal>
    </>
  )
}
