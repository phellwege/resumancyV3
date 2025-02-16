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
    
    function parseBoldSegments(line) {
        const pattern = /\*\*(.*?)\*\*/g; // matches **some text**
        const result = [];
        let lastIndex = 0;
        let match;
    
        while ((match = pattern.exec(line)) !== null) {
        // Push the text before the **...** match
        if (match.index > lastIndex) {
            result.push(line.slice(lastIndex, match.index));
        }
        // Push the <strong> element
        result.push(<strong key={match.index}>{match[1]}</strong>);
    
        // Update the index to continue after the current match
        lastIndex = pattern.lastIndex;
        }
    
        // If there's leftover text after the last match, push it too
        if (lastIndex < line.length) {
        result.push(line.slice(lastIndex));
        }
    
        return result;
    }

    const renderTextWithNewLines = (text) => {
        if (!text) return null;
    
        const lines = text.split('\n');
        return lines.map((line, index) => {
        const shouldIndent = line.startsWith('-');
        // Convert any **bold** in this line to <strong> elements
        const parsedLine = parseBoldSegments(line);
    
        return (
            <p
            key={index}
            className={shouldIndent ? 'indented' : ''}
            style={{ marginBottom: '5px' }}
            >
            {parsedLine}
            </p>
        );
        });
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
